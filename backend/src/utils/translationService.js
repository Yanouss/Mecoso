const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyDKFQmY2waXUSbX-sF-BNM5v3kZkEHzadQ");


// --- RATE LIMITER CONFIG ---
const MAX_REQUESTS_PER_MINUTE = 9; // stay under the 10/min limit
const RATE_WINDOW_MS = 60_000; // 1 minute
const recentRequests = []; // timestamps of recent requests
const delay = (ms) => new Promise(res => setTimeout(res, ms));


const translateText = async (text, targetLang) => {
  try {
    if (!text || text.trim() === '') {
      console.log('Empty text provided for translation');
      return text;
    }

    // --- SMART RATE LIMIT PROTECTION ---
    const now = Date.now();
    // remove old requests
    while (recentRequests.length && now - recentRequests[0] > RATE_WINDOW_MS) {
      recentRequests.shift();
    }

    if (recentRequests.length >= MAX_REQUESTS_PER_MINUTE) {
      const waitTime = RATE_WINDOW_MS - (now - recentRequests[0]) + 500; // +buffer
      console.log(`⏳ Gemini rate limit reached. Waiting ${Math.ceil(waitTime / 1000)}s...`);
      await delay(waitTime);
    }

    recentRequests.push(Date.now());

    console.log(`🔄 Starting translation...`);
    console.log(`   Source text: "${text}"`);
    console.log(`   Target language: ${targetLang}`);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const targetLanguageName = targetLang === 'fr' ? 'French' : 'English';

    const prompt = `You are a professional translator. Translate the following text to ${targetLanguageName}.

CRITICAL RULES:
1. ONLY return the translated text - NO explanations, NO quotes, NO extra words
2. If the text is already in ${targetLanguageName}, still translate it properly
3. Preserve the exact meaning and professional tone
4. Do NOT return the same text - you MUST translate it

Text to translate: ${text}

Your ${targetLanguageName} translation:`;

    const result = await model.generateContent(prompt);
    if (!result?.response) {
      console.error('❌ No response from Gemini API');
      return text;
    }

    let translation = result.response.text().trim().replace(/^["']|["']$/g, '');
    console.log(`✅ Translation completed: "${translation}"`);

    if (translation.toLowerCase() === text.toLowerCase()) {
      console.warn('⚠️ Translation identical to source — API may have skipped it');
    }

    return translation;

  } catch (error) {
    console.error('❌ Translation error:', error.message);

    if (error.message.includes('429')) {
      // Retry gracefully on rate limit
      console.log('⚠️ Gemini API rate limited. Retrying in 20s...');
      await delay(20_000);
      return translateText(text, targetLang);
    }

    if (error.message.includes('model')) {
      try {
        const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
        const result = await fallbackModel.generateContent(prompt);
        const translation = result.response.text().trim().replace(/^["']|["']$/g, '');
        console.log('✅ Fallback translation successful');
        return translation;
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError.message);
      }
    }

    console.error('   Full error:', error);
    return text; // fallback: return original text
  }
};

const detectLanguage = (text) => {
  if (!text || text.trim() === '') {
    console.log('Empty text for language detection, defaulting to English');
    return 'en';
  }
  
  // IMPROVED: More accurate French detection with weighted scoring
  const frenchIndicators = [
    // Strongest indicators - French accented characters (almost guaranteed French)
    { pattern: /[àâäçèéêëîïôùûüÿæœ]/gi, weight: 5, name: 'accented chars' },
    
    // Strong indicators - French contractions and articles
    { pattern: /\b(l'|d'|qu'|c'est|n'est|j'ai|m'a|s'il|t'a)\b/gi, weight: 4, name: 'contractions' },
    
    // Medium-strong indicators - Common French words
    { pattern: /\b(très|être|où|ça|français|aujourd'hui|peut-être)\b/gi, weight: 3, name: 'common words' },
    
    // Medium indicators - French definite articles
    { pattern: /\b(le|la|les|un|une|des)\b/gi, weight: 2, name: 'articles' },
    
    // Weak indicators - Words that exist in both languages or are common
    { pattern: /\b(et|est|sont|pour|avec|dans|sur|sous)\b/gi, weight: 1, name: 'weak words' }
  ];
  
  let frenchScore = 0;
  let matchDetails = [];
  
  frenchIndicators.forEach(({ pattern, weight, name }) => {
    const matches = text.match(pattern);
    if (matches) {
      const score = matches.length * weight;
      frenchScore += score;
      matchDetails.push(`${name}: ${matches.length}×${weight}=${score}`);
    }
  });
  
  // IMPROVED: Higher threshold and better logic
  // If we have accented characters (score >= 5), it's definitely French
  // Otherwise, need score >= 8 to be confident it's French
  const hasAccents = /[àâäçèéêëîïôùûüÿæœ]/i.test(text);
  const detectedLang = (hasAccents || frenchScore >= 8) ? 'fr' : 'en';
  
  console.log(`🌍 Language detection for: "${text.substring(0, 80)}..."`);
  console.log(`   French score: ${frenchScore} (threshold: 8)`);
  console.log(`   Has accents: ${hasAccents}`);
  console.log(`   Match details: [${matchDetails.join(', ')}]`);
  console.log(`   ➡️  DETECTED: ${detectedLang.toUpperCase()}`);
  
  return detectedLang;
};

// Test function to verify API works
const testGeminiAPI = async () => {
  try {
    console.log('🧪 Testing Gemini API connection with latest model...');
    console.log('   Testing English to French...');
    
    const enToFr = await translateText('Hello world', 'fr');
    console.log(`   Result: "${enToFr}"`);
    
    console.log('   Testing French to English...');
    const frToEn = await translateText('Bonjour le monde', 'en');
    console.log(`   Result: "${frToEn}"`);
    
    if (enToFr !== 'Hello world' && frToEn !== 'Bonjour le monde') {
      console.log('✅ Gemini API test successful!');
      return true;
    } else {
      console.log('⚠️  Gemini API returned same text - translation may not be working');
      return false;
    }
  } catch (error) {
    console.error('❌ Gemini API test failed:', error.message);
    return false;
  }
};

module.exports = {
  translateText,
  detectLanguage,
  testGeminiAPI
};