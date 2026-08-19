export const nezukoDetailDefaults = {
  productName: '네즈코 코스프레 세트', category: '귀멸의 칼날', price: 59000, discountRate: 20, stockStatus: '판매 중',
  images: { main: '/img/content-cosplay/cosplay-38-product.png', thumbnail: '/img/content-cosplay/nezuko-detail.png', worn: '/img/content-cosplay/cosplay-38-worn.png', accessories: '/img/content-cosplay/nezuko-geta.png', video: '/img/content-cosplay/nezuko-wearing-guide.mp4', videoPoster: '/img/content-cosplay/nezuko-wearing-guide.png' },
  shortDescription: '분홍 기하학 무늬 기모노부터 가발과 소품까지 한 번에 준비한 네즈코 코스프레 세트입니다.',
  description: '사진에서 색감과 실루엣이 또렷하게 보이도록 원단과 디테일을 정성스럽게 구성했습니다. 졸업사진, 행사, 촬영 등 특별한 하루를 간편하게 완성해 보세요.',
  features: ['완성도 높은 올인원 세트', '사진에 선명한 색감과 디테일', '움직임을 고려한 편안한 설계'],
  rental: { sizes: ['S','M','L'], sizeStock: { S: 2, M: 4, L: 1 }, quantity: 7, periods: ['1박','1박 2일','2박 3일'] },
  inclusions: { costume: true, wig: false, props: false },
  sizeTable: [{ size:'S', chest:'82~86', waist:'64~68', length:'128' },{ size:'M', chest:'87~92', waist:'69~74', length:'132' },{ size:'L', chest:'93~98', waist:'75~80', length:'136' }],
  delivery: { fee:'무료', arrival:'예약일 하루 전까지 도착', returnMethod:'구성품을 포장해 문 앞에 두면 방문 수거', exchange:'착용 전 사이즈 이상 확인 시 당일 고객센터 문의' },
  care: { material:'폴리에스터 기모노 원단, 인조모 가발, EVA 소품', washing:'반납 후 전문 세탁과 고온 살균을 진행합니다.', caution:'화기와 강한 오염에 주의하고 고객이 직접 세탁하지 마세요.' },
  reviews: [
    { visible:true, image:'/img/content-cosplay/nezuko-review-01.png', rating:5, author:'김하늘', text:'행사장에서 친구들과 촬영했는데 색감이 선명하고 세트 구성이 좋아 준비가 정말 편했어요.' },
    { visible:true, image:'/img/content-cosplay/nezuko-review-02.png', rating:5, author:'이서윤', text:'야외 촬영에서도 의상이 자연스럽고 사진이 예쁘게 나왔어요. 사이즈 안내도 정확했습니다.' },
    { visible:true, image:'/img/content-cosplay/nezuko-review-03.png', rating:4.5, author:'박지민', text:'대여실에서 바로 입어봤는데 핏이 좋고 가발과 소품 상태도 깔끔해서 만족스러웠어요.' },
  ],
  sectionOrder: ['detail','worn','video','reviews'], visibility:'공개'
};

export const makeProductDetailDefaults = (product) => ({
  ...nezukoDetailDefaults,
  productName: product.name,
  category: product.category,
  price: Number(product.price) || 0,
  discountRate: 0,
  images: {
    main: product.images?.[0] || product.thumbnail || '',
    thumbnail: product.thumbnail || product.images?.[0] || '',
    worn: product.images?.[1] || product.thumbnail || '',
    accessories: product.accessories?.[0]?.src || product.images?.[2] || product.thumbnail || '',
    video: '', videoPoster: product.images?.[1] || product.thumbnail || '',
  },
  shortDescription: product.shortDesc || product.description || '',
  description: product.description || product.history || '',
  features: [product.history || '상품의 고유한 분위기와 디테일', '촬영에 잘 어울리는 선명한 색감', '편안한 착용과 간편한 반납'],
  rental: {
    sizes: product.sizes || ['S','M','L'],
    sizeStock: Object.fromEntries((product.sizes || ['S','M','L']).map((size) => [size, 3])),
    quantity: 9,
    periods: [product.rentalPeriod || '2박 3일'],
  },
  inclusions: { costume:true, wig:Boolean(product.contentKey === 'cosplay'), props:Boolean(product.composition) },
  reviews: nezukoDetailDefaults.reviews.map((review) => ({ ...review })),
});
