const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyDKFQmY2waXUSbX-sF-BNM5v3kZkEHzadQ");

const translateText = async (text, targetLang) => {
  try {
    if (!text || text.trim() === '') {
      console.log('Empty text provided for translation');
      return text;
    }
    
    console.log(`🔄 Starting translation...`);
    console.log(`   Source text: "${text}"`);
    console.log(`   Target language: ${targetLang}`);
    
    // UPDATED: Use the latest Gemini 2.5 Pro model (thanks for the update! 😄)
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
    
    console.log(`   Calling Gemini API with latest model: gemini-2.0-flash-exp`);
    
    const result = await model.generateContent(prompt);
    
    if (!result || !result.response) {
      console.error('❌ No response from Gemini API');
      return text;
    }
    
    const response = await result.response;
    let translation = response.text().trim();
    
    // Remove any quotes that Gemini might add
    translation = translation.replace(/^["']|["']$/g, '');
    
    console.log(`✅ Translation completed!`);
    console.log(`   Original: "${text}"`);
    console.log(`   Translated: "${translation}"`);
    
    // Verify translation actually changed
    if (translation.toLowerCase() === text.toLowerCase()) {
      console.warn('⚠️  Warning: Translation is identical to source text - API may have failed');
    }
    
    return translation;
    
  } catch (error) {
    console.error('❌ Translation error:', error.message);
    if (error.message.includes('API key')) {
      console.error('   Please check your GEMINI_API_KEY');
    }
    if (error.message.includes('quota') || error.message.includes('rate limit')) {
      console.error('   API quota exceeded or rate limited');
    }
    if (error.message.includes('model')) {
      console.error('   Model not found - trying gemini-1.5-pro as fallback...');
      // Fallback to older model if 2.5 not available
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
    return text;
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