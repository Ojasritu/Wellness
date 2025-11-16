"""
Ojasritu Wellness - AI Chatbot with Gemini API
World-class Ayurveda Expert Assistant with Sanskrit Sloks
"""

import os
import json
from datetime import datetime
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY and GEMINI_AVAILABLE:
    genai.configure(api_key=GEMINI_API_KEY)

# Sanskrit Sloks and Ayurveda wisdom
AYURVEDA_SLOKS = {
    'health': {
        'hi': '॥ समदोषः समाग्निश्च समधातुमलक्रियः। प्रसन्नात्मेन्द्रियमनः स्वस्थ इति अभिधीयते ॥',
        'en': '|| Sama-doshas sama-agnis cha sama-dhatu-mala-kriyas || Prasanna-atma-indriya-manah svastha iti abhidhiyate ||',
        'meaning_hi': 'जिसके सभी दोष संतुलित हैं, पाचन अच्छा है, धातुएं सुव्यवस्थित हैं, और मन शांत है - वह स्वस्थ है।',
        'meaning_en': 'One with balanced doshas, good digestion, proper dhatus, and peaceful mind is healthy.'
    },
    'prevention': {
        'hi': '॥ स्वस्थस्य स्वास्थ्य रक्षणं अतुरस्य विकार प्रशमनं च चिकित्सा ॥',
        'en': '|| Swasthasyа svasthya rakshnam aturasya vikar prashamanam cha chikitsa ||',
        'meaning_hi': 'स्वस्थ रहने वाले का स्वास्थ्य रक्षण करना और बीमार का इलाज करना - यही चिकित्सा है।',
        'meaning_en': 'Maintaining health of the healthy and curing diseases of the sick is medicine.'
    },
    'nature': {
        'hi': '॥ प्रकृति विक्रियो रोगः प्रकृत्यैव विनिर्यते ॥',
        'en': '|| Prakriti Vikriyo Rogah Prakrutyaiva Vinirgate ||',
        'meaning_hi': 'प्रकृति (प्राकृतिक संतुलन) से विचलन ही रोग है। प्रकृति में ही इसका समाधान है।',
        'meaning_en': 'Deviation from nature is disease. Nature itself holds the cure.'
    },
    'dosha': {
        'hi': '॥ वायुः पित्तं कफश्चेति त्रयो दोषाः समुच्यते। एषां साम्यं रोगः साम्यं सुस्थः ॥',
        'en': '|| Vayuh pittam kaphashcheti trayo doshas samuchyate || Eshan samyam rogah samyam susthah ||',
        'meaning_hi': 'वात, पित्त और कफ तीनों दोष कहलाते हैं। इनका संतुलन स्वास्थ्य है और असंतुलन रोग।',
        'meaning_en': 'Vata, Pitta, and Kapha are the three doshas. Their balance is health, imbalance is disease.'
    }
}

# Enhanced system prompt
AYURVEDA_SYSTEM_PROMPT = """आप Ojasritu Wellness के लिए एक प्राचीन आयुर्वेद विशेषज्ञ हैं।

आपकी विशेषताएं:
1. संस्कृत श्लोकों के साथ जवाब दें
2. तीनों दोषों (वात, पित्त, कफ) के बारे में विस्तार से बताएं
3. वर्तमान मौसम के अनुसार सलाह दें
4. प्राकृतिक उपचार पर जोर दें
5. Ojasritu के उत्पादों का सुझाव दें जहां उपयुक्त हो

आपको हमेशा:
- हिंदी और अंग्रेजी दोनों में जवाब देना चाहिए
- सरल और समझने में आसान भाषा का उपयोग करना चाहिए
- संबंधित श्लोक या प्राचीन ज्ञान का उल्लेख करना चाहिए
- चिकित्सा पेशेवर से परामर्श लेने की सलाह देनी चाहिए
- 3-4 लाइन में संक्षिप्त, लेकिन जानकारीपूर्ण उत्तर देना चाहिए"""

# Fallback responses with sloks
FALLBACK_RESPONSES = {
    'hi': {
        'greeting': 'नमस्ते! 🙏 मैं आपकी आयुर्वेद से संबंधित किसी भी सवाल का जवाब देने में खुश हूं। आप क्या जानना चाहते हैं?',
        'dosha': '॥ समदोषः समाग्निश्च ॥ तीनों दोष (वात, पित्त, कफ) के संतुलन से ही स्वास्थ्य मिलता है। क्या आप अपने दोष के बारे में जानना चाहते हैं?',
        'health': 'आयुर्वेद कहता है - संतुलित आहार, नियमित दिनचर्या और मन की शांति ही स्वास्थ्य की कुंजी है। आप किसी विशेष समस्या के लिए सलाह चाहते हैं?',
        'products': '🌿 Ojasritu के सभी उत्पाद प्राकृतिक और आयुर्वेदिक सिद्धांतों पर आधारित हैं। क्या मैं आपको कोई विशेष उत्पाद सुझा सकता हूं?',
        'default': 'कृपया अपना सवाल फिर से दोहराएं। मैं आपकी सहायता करने के लिए यहां हूं। 🙏'
    },
    'en': {
        'greeting': 'Namaste! 🙏 I am here to answer any Ayurveda-related questions. What would you like to know?',
        'dosha': '|| Sama-doshas sama-agnis cha || Balance of the three doshas (Vata, Pitta, Kapha) is the foundation of health. Would you like to learn about your dosha?',
        'health': 'Ayurveda teaches - balanced diet, proper daily routine, and peaceful mind are the keys to health. Do you need advice on a specific concern?',
        'products': '🌿 All Ojasritu products are natural and based on authentic Ayurvedic principles. Can I suggest a suitable product for you?',
        'default': 'Please repeat your question. I am here to help you. 🙏'
    }
}

def get_smart_fallback(message, language='en'):
    """Get intelligent fallback response based on message content"""
    message_lower = message.lower()
    
    if any(word in message_lower for word in ['dosha', 'vata', 'pitta', 'kapha', 'constitution']):
        return FALLBACK_RESPONSES[language]['dosha']
    elif any(word in message_lower for word in ['health', 'healthy', 'wellness', 'sick', 'disease']):
        return FALLBACK_RESPONSES[language]['health']
    elif any(word in message_lower for word in ['product', 'oil', 'powder', 'supplement', 'buy']):
        return FALLBACK_RESPONSES[language]['products']
    elif any(word in message_lower for word in ['hello', 'hi', 'namaste', 'hey', 'start']):
        return FALLBACK_RESPONSES[language]['greeting']
    else:
        return FALLBACK_RESPONSES[language]['default']

@api_view(['POST'])
def chat_with_ayurveda_ai(request):
    """
    AI Chatbot endpoint with Gemini integration and fallbacks
    """
    try:
        message = request.data.get('message', '').strip()
        language = request.data.get('language', 'en')
        
        if not message:
            return Response({
                'status': 'error',
                'message': 'Message is required',
                'error': 'empty_message'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Try Gemini API first
        if GEMINI_AVAILABLE and GEMINI_API_KEY:
            try:
                model = genai.GenerativeModel('gemini-pro')
                
                # Add slok to the message for better context
                slok_context = ""
                for slok_key, slok_data in list(AYURVEDA_SLOKS.items())[:2]:
                    slok_context += f"\n• {slok_data.get(language, slok_data.get('en'))}"
                
                prompt = f"""{AYURVEDA_SYSTEM_PROMPT}

कुछ प्रमुख श्लोक:{slok_context}

ग्राहक का सवाल: {message}
उत्तर भाषा: {'हिंदी (Hindi)' if language == 'hi' else 'English'}

कृपया 3-4 लाइन में जवाब दें और यदि संभव हो तो एक संस्कृत श्लोक या कहावत जोड़ें।"""
                
                response = model.generate_content(prompt)
                reply_text = response.text if response.text else get_smart_fallback(message, language)
                
                return Response({
                    'status': 'success',
                    'message': reply_text,
                    'language': language,
                    'timestamp': datetime.now().isoformat(),
                    'source': 'gemini'
                })
            
            except Exception as gemini_error:
                print(f"Gemini API Error: {str(gemini_error)}")
                # Fall through to fallback
        
        # Fallback response
        fallback_msg = get_smart_fallback(message, language)
        
        return Response({
            'status': 'success',
            'message': fallback_msg,
            'language': language,
            'timestamp': datetime.now().isoformat(),
            'source': 'fallback',
            'slok': AYURVEDA_SLOKS['health']
        })
    
    except Exception as e:
        print(f"Chatbot Error: {str(e)}")
        return Response({
            'status': 'error',
            'message': 'कुछ गलत हुआ / An error occurred',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def dosha_analyzer(request):
    """Dosha analyzer with detailed results"""
    try:
        answers = request.data.get('answers', {})
        language = request.data.get('language', 'en')
        
        if not answers:
            return Response({
                'error': 'Answers are required',
                'status': 'error'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Calculate dosha scores
        vata_score = sum(v for k, v in answers.items() if 'body' in k or 'skin' in k)
        pitta_score = sum(v for k, v in answers.items() if 'appetite' in k or 'temp' in k)
        kapha_score = sum(v for k, v in answers.items() if 'weight' in k or 'energy' in k)
        
        total = vata_score + pitta_score + kapha_score
        
        vata_percentage = int((vata_score / total * 100) if total > 0 else 33)
        pitta_percentage = int((pitta_score / total * 100) if total > 0 else 33)
        kapha_percentage = int((kapha_score / total * 100) if total > 0 else 34)
        
        # Determine primary dosha
        scores = {
            'vata': vata_percentage,
            'pitta': pitta_percentage,
            'kapha': kapha_percentage
        }
        primary_dosha = max(scores, key=scores.get)
        
        # Recommendations
        recommendations = {
            'hi': {
                'vata': [
                    '🌡️ गर्म, तैलीय खाद्य पदार्थ खाएं',
                    '⏰ नियमित दिनचर्या बनाएं',
                    '🧘 योग और ध्यान करें',
                    '😴 पर्याप्त नींद लें (8 घंटे)'
                ],
                'pitta': [
                    '❄️ ठंडे, रस युक्त खाद्य पदार्थ खाएं',
                    '🌙 गर्मी से बचें',
                    '😌 मानसिक शांति बनाए रखें',
                    '💧 पर्याप्त पानी पिएं'
                ],
                'kapha': [
                    '🔥 गर्म, हल्के खाद्य पदार्थ खाएं',
                    '🏃 व्यायाम और गतिविधि बढ़ाएं',
                    '☀️ सुबह जल्दी उठें',
                    '🌶️ मसालेदार खाना खाएं'
                ]
            },
            'en': {
                'vata': [
                    '🌡️ Eat warm, oily foods',
                    '⏰ Maintain regular routine',
                    '🧘 Practice yoga and meditation',
                    '😴 Get adequate sleep (8 hours)'
                ],
                'pitta': [
                    '❄️ Eat cool, juicy foods',
                    '🌙 Avoid excess heat',
                    '😌 Maintain mental peace',
                    '💧 Drink plenty of water'
                ],
                'kapha': [
                    '🔥 Eat warm, light foods',
                    '🏃 Increase exercise and activity',
                    '☀️ Wake up early',
                    '🌶️ Include spices in meals'
                ]
            }
        }
        
        result = {
            'status': 'success',
            'scores': {
                'vata': vata_percentage,
                'pitta': pitta_percentage,
                'kapha': kapha_percentage
            },
            'primary_dosha': primary_dosha,
            'recommendations': recommendations[language][primary_dosha],
            'slok': AYURVEDA_SLOKS['dosha']
        }
        
        return Response({'status': 'success', 'result': result})
    
    except Exception as e:
        return Response({
            'status': 'error',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_ayurveda_tips(request):
    """Get daily Ayurveda tips with sloks"""
    try:
        language = request.query_params.get('language', 'en')
        tip_type = request.query_params.get('type', 'all')
        
        tips = [
            {
                'title_hi': 'नियमित दिनचर्या का महत्व',
                'title_en': 'Importance of Daily Routine',
                'description_hi': 'आयुर्वेद कहता है कि नियमित दिनचर्या शरीर और मन को स्वस्थ रखती है। हर दिन एक ही समय पर सोना, जागना और खाना खाना चाहिए।',
                'description_en': 'Ayurveda emphasizes that a regular daily routine maintains physical and mental health. Sleep, wake, and eat at the same time every day.',
                'category': 'lifestyle',
                'slok': AYURVEDA_SLOKS['prevention'],
                'benefits_hi': ['बेहतर पाचन', 'मजबूत प्रतिरक्षा', 'अच्छी नींद'],
                'benefits_en': ['Better digestion', 'Strong immunity', 'Good sleep']
            },
            {
                'title_hi': 'तीनों दोषों को समझें',
                'title_en': 'Understanding Three Doshas',
                'description_hi': 'वात (हवा), पित्त (अग्नि) और कफ (पृथ्वी-जल) - ये तीनों दोष शरीर में संतुलन बनाते हैं।',
                'description_en': 'Vata (air), Pitta (fire), and Kapha (earth-water) - these three doshas maintain balance in the body.',
                'category': 'dosha',
                'slok': AYURVEDA_SLOKS['dosha'],
                'benefits_hi': ['दोष संतुलन', 'सुस्वास्थ्य', 'निरोगता'],
                'benefits_en': ['Dosha balance', 'Good health', 'Disease-free']
            },
            {
                'title_hi': 'ऋतु अनुसार आहार',
                'title_en': 'Seasonal Eating',
                'description_hi': 'हर मौसम में अलग-अलग खाद्य पदार्थ फायदेमंद हैं। गर्मी में ठंडे और सर्दी में गर्म खाद्य पदार्थ खाएं।',
                'description_en': 'Different foods suit different seasons. Eat cooling foods in summer and warming foods in winter.',
                'category': 'seasonal',
                'slok': {'hi': '॥ ऋतुनुसारं आहारविहारं ॥', 'en': '|| Ritu-anusar ahar-vihar ||'},
                'benefits_hi': ['मौसमी स्वास्थ्य', 'बेहतर पाचन', 'ऊर्जा'],
                'benefits_en': ['Seasonal wellness', 'Better digestion', 'Energy']
            }
        ]
        
        # Filter by type if specified
        if tip_type != 'all':
            tips = [t for t in tips if t['category'] == tip_type]
        
        # Format response based on language
        formatted_tips = []
        for tip in tips:
            formatted_tips.append({
                'title': tip.get(f'title_{language}', tip['title_en']),
                'description': tip.get(f'description_{language}', tip['description_en']),
                'category': tip['category'],
                'slok': tip['slok'].get(language, tip['slok'].get('en', '')),
                'benefits': tip.get(f'benefits_{language}', tip['benefits_en'])
            })
        
        return Response({
            'status': 'success',
            'tips': formatted_tips,
            'count': len(formatted_tips)
        })
    
    except Exception as e:
        return Response({
            'status': 'error',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
