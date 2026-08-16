// 입어봄(IBUBOM) 고객상담 챗봇 - OpenAI 프록시
// 클라이언트는 이 Edge Function만 호출하고, OpenAI API 키는 서버(Supabase Secrets)에만 보관된다.

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const OPENAI_MODEL = 'gpt-4o-mini';
const MAX_HISTORY_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 1000;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const SYSTEM_PROMPT = `당신은 이벤트 특수의상 대여 사이트 '입어봄(IBUBOM)'의 고객상담 챗봇입니다.
슬로건: "다른 사람이 되어 하루를 빌린다. 새로운 경험을 하다. 오늘만큼은 뭐든지 되어볼 수 있다."

[사이트 정보]
- 카테고리: 전통한복(평상복/예복/관복/선비/왕/노비), 각 나라 전통의상, 코스프레, 공연의상
- 대여 절차: 01 의상 선택 -> 02 사이즈/날짜 선택 -> 03 배송받기 -> 04 신나게 입기 -> 05 문앞에 두면 반납완료
- 배송: 오늘 주문시 오늘 도착 가능
- 위생: 100% 세탁 및 고온살균 처리 후 배송
- 반납: 문앞에 수거함을 두면 간편하게 수거
- 단체주문: 추가 할인 제공
- 맞춤상담: 방송국 대여, 영화 촬영 등 다수 대여 경험으로 컨셉 추천 가능
- 기본 대여기간: 2박 3일, 사이즈: S/M/L

[답변 규칙]
- 한국어로, 친절하고 간결하게 답변한다 (3~5문장 이내 권장).
- 사이트에 없는 정보(정확한 재고, 실시간 배송 현황, 결제 처리 등)는 모른다고 솔직히 말하고 고객센터(1588-0000, hello@ibubom.com) 안내로 연결한다.
- 의상 대여와 무관한 질문에는 정중히 화제를 사이트 안내로 돌린다.
- 가격을 확실히 모르면 임의로 지어내지 말고 "정확한 가격은 상품 상세페이지를 확인해주세요"라고 안내한다.`;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: '서버에 OPENAI_API_KEY가 설정되어 있지 않습니다.' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'messages 배열이 필요합니다.' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const safeHistory = messages
      .slice(-MAX_HISTORY_MESSAGES)
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_MESSAGE_LENGTH) }));

    if (safeHistory.length === 0) {
      return new Response(JSON.stringify({ error: '유효한 메시지가 없습니다.' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...safeHistory],
        max_tokens: 400,
        temperature: 0.6,
      }),
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error('OpenAI API error:', openaiRes.status, errText);
      return new Response(JSON.stringify({ error: 'AI 응답 생성에 실패했습니다.' }), {
        status: 502,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const data = await openaiRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim() ?? '죄송해요, 답변을 생성하지 못했어요.';

    return new Response(JSON.stringify({ reply }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('chat-widget error:', err);
    return new Response(JSON.stringify({ error: '요청 처리 중 오류가 발생했습니다.' }), {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
