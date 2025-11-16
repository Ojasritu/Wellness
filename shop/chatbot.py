"""
Ojasritu Wellness - AI Chatbot using Google Gemini API
Ayurveda-focused intelligent assistant
"""

import os
import json
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse
import google.generativeai as genai

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

AYURVEDA_SYSTEM_PROMPT = """
आप Ojasritu Wellness का एक विशेषज्ञ आयुर्वेद सलाहकार हैं। 

आपकी भूमिका:
1. ग्राहकों को आयुर्वेद के बारे में शिक्षित करना
2. दोष विश्लेषण (वात, पित्त, कफ) में मदद करना
3. उपयुक्त आयुर्वेदिक उत्पादों की सिफारिश करना
4. स्वास्थ्य और कल्याण सलाह देना
5. परामर्श बुकिंग के लिए मार्गदर्शन करना

महत्वपूर्ण:
- हमेशा हिंदी और अंग्रेजी दोनों में जवाब दें
- चिकित्सा सलाह के लिए हमेशा पेशेवर परामर्श लेने की सलाह दें
- Ojasritu के उत्पादों का सकारात्मक उल्लेख करें
- रोगी की गोपनीयता का सम्मान करें

आयुर्वेद के मूल सिद्धांत:
- त्रिदोष सिद्धांत (वात, पित्त, कफ)
- षड्रस (मीठा, खट्टा, नमकीन, कड़वा, कसैला, तीखा)
- दिनचर्या और ऋतुचर्या
- खान-पान और जीवनशैली
"""


@api_view(['POST'])
def chat_with_ayurveda_ai(request):
    """
    Main chatbot endpoint
    Accepts: {"message": "user message", "language": "en/hi"}
    """
    try:
        message = request.data.get('message', '')
        language = request.data.get('language', 'en')
        user_history = request.data.get('history', [])
        
        if not message:
            return Response(
                {'error': 'Message is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Build conversation history for context
        conversation = []
        for msg in user_history[-5:]:  # Keep last 5 messages for context
            conversation.append({
                "role": msg.get("role", "user"),
                "parts": [msg.get("content", "")]
            })
        
        # Add current message
        conversation.append({
            "role": "user",
            "parts": [message]
        })
        
        # Call Gemini API
        try:
            model = genai.GenerativeModel('gemini-pro')
            
            # Create chat session with system prompt
            chat = model.start_chat(history=conversation[:-1] if len(conversation) > 1 else [])
            
            response = chat.send_message(
                f"{AYURVEDA_SYSTEM_PROMPT}\n\nग्राहक का सवाल: {message}\n\nजवाब भाषा: {language}",
                stream=False
            )
            
            reply_text = response.text
            
            return Response({
                'status': 'success',
                'message': reply_text,
                'language': language,
                'timestamp': pd.Timestamp.now().isoformat() if 'pd' in dir() else str(__import__('datetime').datetime.now())
            })
        
        except Exception as api_error:
            print(f"Gemini API Error: {str(api_error)}")
            # Fallback response if API fails
            return Response({
                'status': 'success',
                'message': get_fallback_response(message, language),
                'language': language,
                'is_fallback': True
            })
    
    except Exception as e:
        print(f"Chatbot Error: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
def dosha_analyzer(request):
    """
    Analyze user's dosha type based on questionnaire
    """
    try:
        answers = request.data.get('answers', {})
        
        if not answers:
            return Response(
                {'error': 'Answers are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Calculate dosha scores
        vata_score = sum([
            answers.get('thin_body', 0),
            answers.get('quick_mind', 0),
            answers.get('dry_skin', 0),
            answers.get('irregular_digestion', 0),
            answers.get('loves_movement', 0)
        ])
        
        pitta_score = sum([
            answers.get('medium_build', 0),
            answers.get('sharp_intellect', 0),
            answers.get('warm_body', 0),
            answers.get('good_digestion', 0),
            answers.get('competitive', 0)
        ])
        
        kapha_score = sum([
            answers.get('heavy_build', 0),
            answers.get('calm_mind', 0),
            answers.get('oily_skin', 0),
            answers.get('slow_digestion', 0),
            answers.get('loves_rest', 0)
        ])
        
        # Determine primary dosha
        scores = {
            'vata': vata_score,
            'pitta': pitta_score,
            'kapha': kapha_score
        }
        
        primary_dosha = max(scores, key=scores.get)
        
        # Get recommendations
        recommendations = get_dosha_recommendations(primary_dosha)
        
        return Response({
            'status': 'success',
            'primary_dosha': primary_dosha,
            'scores': scores,
            'recommendations': recommendations,
            'advice': get_dosha_advice(primary_dosha)
        })
    
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
def get_ayurveda_tips(request):
    """
    Get daily Ayurveda tips and sloks
    """
    tips = {
        'hindi': [
            {
                'title': 'सुबह की दिनचर्या',
                'slok': 'अगस्त्य: सूर्यस्य परमं पदम्\nतस्य ज्ञानं तमसः परे।',
                'tip': 'सुबह जल्दी उठें, पाचन तंत्र को सक्रिय करें।',
                'benefits': ['बेहतर पाचन', 'मानसिक स्पष्टता', 'ऊर्जा में वृद्धि']
            },
            {
                'title': 'आहार सिद्धांत',
                'slok': 'भोजनं रसनस्योच्यते\nआयुर्वेदे महत्वपूर्णम्।',
                'tip': 'मौसमी फल और सब्जियां खाएं।',
                'benefits': ['संतुलित पोषण', 'रोग प्रतिरोधक क्षमता', 'दीर्घायु']
            },
            {
                'title': 'योग और ध्यान',
                'slok': 'योगश्चित्तवृत्तिनिरोधः।',
                'tip': 'प्रतिदिन 20 मिनट ध्यान करें।',
                'benefits': ['मानसिक शांति', 'तनाव कम होना', 'आत्मजागरूकता']
            }
        ],
        'english': [
            {
                'title': 'Morning Routine',
                'slok': 'Early rising brings health and wisdom.',
                'tip': 'Wake up early, activate your digestive system.',
                'benefits': ['Better digestion', 'Mental clarity', 'Increased energy']
            },
            {
                'title': 'Dietary Principles',
                'slok': 'Food is medicine, medicine is food.',
                'tip': 'Eat seasonal fruits and vegetables.',
                'benefits': ['Balanced nutrition', 'Immunity', 'Longevity']
            },
            {
                'title': 'Yoga & Meditation',
                'slok': 'Yoga is the science of the mind.',
                'tip': 'Meditate for 20 minutes daily.',
                'benefits': ['Mental peace', 'Stress relief', 'Self-awareness']
            }
        ]
    }
    
    language = request.query_params.get('language', 'en')
    tip_type = request.query_params.get('type', 'daily')
    
    return Response({
        'status': 'success',
        'tips': tips.get(language, tips['english']),
        'language': language
    })


def get_fallback_response(message, language='en'):
    """
    Fallback responses when API is unavailable
    """
    fallback_responses = {
        'en': {
            'greeting': "नमस्ते! Ojasritu Wellness में आपका स्वागत है। मैं आपकी आयुर्वेद से संबंधित सभी जिज्ञासाओं का समाधान करने के लिए यहां हूँ। क्या आप अपने स्वास्थ्य के बारे में कुछ जानना चाहेंगे?",
            'dosha': "आपके दोष के बारे में जानने के लिए, कृपया हमारे विशेषज्ञ से परामर्श लें। आप एक परामर्श सत्र बुक कर सकते हैं।",
            'product': "हमारे पास विभिन्न आयुर्वेदिक उत्पाद हैं। कृपया हमारे उत्पाद पृष्ठ पर जाएं या हमें संपर्क करें।",
            'default': "धन्यवाद आपके सवाल के लिए। आप कृपया हमारे विशेषज्ञ से सीधे परामर्श लें।"
        },
        'hi': {
            'greeting': "नमस्ते! Ojasritu Wellness में आपका स्वागत है। मैं आपकी सभी आयुर्वेद संबंधित प्रश्नों का उत्तर देने के लिए यहां हूँ।",
            'dosha': "अपने दोष के बारे में जानने के लिए कृपया परामर्श बुक करें।",
            'product': "हमारे आयुर्वेदिक उत्पादों का पता लगाने के लिए उत्पाद पृष्ठ देखें।",
            'default': "आपके सवाल के लिए धन्यवाद। कृपया हमसे संपर्क करें।"
        }
    }
    
    responses = fallback_responses.get(language, fallback_responses['en'])
    
    message_lower = message.lower()
    if 'hello' in message_lower or 'hi' in message_lower or 'नमस्ते' in message:
        return responses['greeting']
    elif 'dosha' in message_lower or 'दोष' in message:
        return responses['dosha']
    elif 'product' in message_lower or 'उत्पाद' in message:
        return responses['product']
    
    return responses['default']


def get_dosha_recommendations(dosha):
    """
    Get product recommendations based on dosha type
    """
    recommendations = {
        'vata': {
            'foods': ['तिल', 'घी', 'गर्म दूध', 'गेहूं'],
            'products': ['वात शांति चूर्ण', 'अश्वगंधा तेल', 'सेसम ऑयल'],
            'lifestyle': ['नियमित दिनचर्या', 'गर्म भोजन', 'ध्यान और योग']
        },
        'pitta': {
            'foods': ['नारियल', 'खीरा', 'तरबूज', 'दूध'],
            'products': ['पित्त शांति चूर्ण', 'चंदन का तेल', 'नीम का तेल'],
            'lifestyle': ['ठंडे पानी का सेवन', 'सूर्य से बचाव', 'शांतिपूर्ण वातावरण']
        },
        'kapha': {
            'foods': ['मूंग दाल', 'शहद', 'मसाले', 'हल्का भोजन'],
            'products': ['कफ शांति चूर्ण', 'त्रिफला चूर्ण', 'गुड़ुची तेल'],
            'lifestyle': ['व्यायाम', 'हल्का भोजन', 'सूर्य का सेवन']
        }
    }
    
    return recommendations.get(dosha, {})


def get_dosha_advice(dosha):
    """
    Get detailed advice for each dosha type
    """
    advice = {
        'vata': {
            'hindi': 'वात प्रकृति वाले व्यक्तियों को गर्म, घी और तेल से युक्त भोजन करना चाहिए। नियमित दिनचर्या बहुत महत्वपूर्ण है।',
            'english': 'Vata-dominant individuals should consume warm, oily foods. Regular routines are essential.'
        },
        'pitta': {
            'hindi': 'पित्त प्रकृति वाले व्यक्तियों को ठंडे, मीठे और तरल पदार्थों का सेवन करना चाहिए। सूर्य से बचाव आवश्यक है।',
            'english': 'Pitta-dominant individuals should have cool, sweet foods. Sun protection is important.'
        },
        'kapha': {
            'hindi': 'कफ प्रकृति वाले व्यक्तियों को हल्का, गर्म और मसालेदार भोजन करना चाहिए। व्यायाम बहुत महत्वपूर्ण है।',
            'english': 'Kapha-dominant individuals should have light, warm, spiced foods. Exercise is crucial.'
        }
    }
    
    return advice.get(dosha, {})
