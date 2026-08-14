/**
 * 입어봄 IBUBOM 디자인 토큰
 * 컬러 / 폰트 / 컨텐츠별 테마 컬러를 한 곳에서 관리한다.
 */

export const COLORS = {
  black: '#171717',
  white: '#FFFDF8',
  purple: '#7C4DFF',
  yellow: '#FFD84D',
  pink: '#FF5C8A',
  mint: '#49D6B4',
};

/**
 * 컨텐츠별 테마 컬러
 * 한복 -> pink / 각 나라 전통의상 -> yellow / 코스프레 -> purple / 공연의상 -> mint
 */
export const CONTENT_THEME = {
  hanbok: { key: 'hanbok', accent: COLORS.pink, bg: '#FBF6EC' },
  world: { key: 'world', accent: COLORS.yellow, bg: '#FFF7DE' },
  cosplay: { key: 'cosplay', accent: COLORS.purple, bg: '#F2F2F2' },
  stage: { key: 'stage', accent: COLORS.mint, bg: '#E9FBF5' },
};

/**
 * 폰트 패밀리 토큰
 * - gmarket: 통통하고 친근함 (로고 / 메인 / 타이틀)
 * - paperlogy: 트렌디하고 세련됨 (로고 / 메인 / 타이틀)
 * - chab: 장난스럽고 개성강함 (로고 / 메인 / 타이틀)
 * - blackHan: 굵고 강렬함 (메인 카피)
 * - doHyeon: 복고 + 개성 (의상 카피)
 * - pretendard: 깔끔한 고딕 (상세설명)
 */
export const FONTS = {
  gmarket: "'GMarketSans', sans-serif",
  paperlogy: "'Paperlogy', sans-serif",
  chab: "'LOTTERIA CHAB', sans-serif",
  blackHan: "'Black Han Sans', sans-serif",
  doHyeon: "'Do Hyeon', sans-serif",
  pretendard: "'Pretendard', sans-serif",
};
