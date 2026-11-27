// 시약 추가: 같은 항목을 가진 객체를 REAGENTS에 추가합니다.
// 일반 물질 참고 정보입니다. 학교 지침·제품 SDS에 따른 별도 검수가 필요합니다.
const FIRST_AID = '눈·피부에 닿으면 즉시 흐르는 물로 충분히 씻고 선생님에게 알리세요. 눈 노출·화상·삼킴·호흡 곤란은 즉시 의료 도움을 요청하세요(긴급 시 119). 세척 중 다른 약품으로 중화하지 말고 제품 SDS의 응급조치를 따르세요.';
const REAGENTS = [
  {name:'염산', formula:'HCl', aliases:['hcl','hydrochloric acid'], group:'acid',
    nature:'강산성 수용액. 눈·피부에 부식성 위험이 있어요.',
    risk:'염기와 반응하면 열이 발생할 수 있고, 금속과도 반응할 수 있어요.',
    incompatible:'수산화나트륨 등 염기, 아민류, 아연 등 금속. 이 목록은 일부 예시입니다.',
    waste:'무기산 폐액 분류 검토 대상. 학교의 지정 용기와 내용물을 선생님에게 확인하세요.',
    firstAid:FIRST_AID, source:'https://www.cdc.gov/niosh/npg/npgd0332.html'},
  {name:'황산', formula:'H₂SO₄', aliases:['h2so4','sulfuric acid'], group:'acid',
    nature:'강산성. 눈·피부에 심한 화상을 일으킬 수 있어요.',
    risk:'특히 농황산은 물과 접촉할 때 큰 열이 발생하며 유기물과 위험하게 반응할 수 있어요.',
    incompatible:'물(특히 농황산), 유기물, 염기, 염소산염, 금속 분말 등. 임의로 희석하지 마세요.',
    waste:'황산 폐액은 농도와 반응성을 따로 확인해야 해요. 다른 산성 폐액에도 임의로 합치지 마세요.',
    firstAid:FIRST_AID, source:'https://www.cdc.gov/niosh/npg/npgd0577.html'},
  {name:'수산화나트륨', formula:'NaOH', aliases:['naoh','sodium hydroxide','가성소다'], group:'base',
    nature:'강염기성. 눈·피부에 부식성 위험이 있어요.',
    risk:'산과 반응하거나 고체가 물에 녹을 때 큰 열이 발생할 수 있어요.',
    incompatible:'산, 알루미늄·아연 등 금속, 가연성 액체 등. 고체는 물과의 접촉도 주의하세요.',
    waste:'알칼리성 폐액 분류 검토 대상. 고체는 폐액통에 넣지 말고 별도 처리 지시를 받으세요.',
    firstAid:FIRST_AID, source:'https://www.cdc.gov/niosh/npg/npgd0565.html'},
  {name:'에탄올', formula:'C₂H₅OH', aliases:['c2h5oh','ethanol','ethyl alcohol'], group:'solvent',
    nature:'휘발성 유기용매. 인화성 액체예요.',
    risk:'불꽃·열·스파크로 불이 붙을 수 있고 강산화제와 위험하게 반응할 수 있어요.',
    incompatible:'강산화제, 나트륨 금속 등. 점화원에서 멀리하세요.',
    waste:'비할로겐 유기용매 폐액 분류 검토 대상. 혼합 성분에 따라 분류가 달라져요.',
    firstAid:FIRST_AID+' 증기를 마셨다면 안전한 신선한 공기가 있는 곳으로 이동하세요.', source:'https://www.cdc.gov/niosh/npg/npgd0262.html'},
  {name:'아세트산', formula:'CH₃COOH', aliases:['ch3cooh','acetic acid','초산','빙초산'], group:'acid',
    nature:'유기산. 고농도에서는 부식성·가연성 위험이 있어요.',
    risk:'강염기와 반응하면 열이 발생할 수 있고 강산화제와 위험하게 반응할 수 있어요.',
    incompatible:'강염기, 강산화제(질산·과산화나트륨 등).',
    waste:'유기산 폐액으로 별도 확인이 필요해요. 무기산 또는 유기용매 폐액통에 임의로 넣지 마세요.',
    firstAid:FIRST_AID, source:'https://www.cdc.gov/niosh/npg/npgd0002.html'}
];

// 검증된 대표 경고만 표시합니다. 규칙에 없는 조합도 안전하다는 뜻이 아닙니다.
const MIX_RULES = [
  {groups:['acid','base'], message:'산과 염기의 반응으로 중화열이 발생해 뜨거워지거나 튈 수 있어요.'},
  {names:['황산','에탄올'], message:'황산과 유기물의 접촉은 심한 발열·위험한 반응을 일으킬 수 있어요.'},
  {names:['황산','아세트산'], message:'황산과 유기산의 혼합은 발열·위험한 반응 가능성이 있어 별도 확인이 필요해요.'},
  {names:['수산화나트륨','에탄올'], message:'수산화나트륨은 가연성 액체와 비호환성이 있어 함께 버리면 안 돼요.'}
];
