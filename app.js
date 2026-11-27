const $ = (id) => document.getElementById(id);
const normalize = (text) => text.trim().toLowerCase().replace(/\s+/g, '');
function findReagent(query) {
  const key = normalize(query);
  return REAGENTS.find(r => [r.name, ...r.aliases].some(name => normalize(name) === key));
}
function evaluateMix(reagents) {
  const warnings = [];
  for (let i = 0; i < reagents.length; i++) {
    for (let j = i + 1; j < reagents.length; j++) {
      const pair = [reagents[i], reagents[j]];
      const matches = MIX_RULES.filter(rule => rule.names
        ? rule.names.every(name => pair.some(r => r.name === name))
        : rule.groups.every(group => pair.some(r => r.group === group)));
      for (const rule of matches) warnings.push(`${pair[0].name} + ${pair[1].name}: ${rule.message}`);
    }
  }
  return warnings;
}
let searched = false;
let blocked = false;
const safetyChecks = [...$('safety').querySelectorAll('input')];
function updateComplete() {
  $('complete').disabled = !searched || blocked || !safetyChecks.every(input => input.checked);
}
function resetSafety() {
  safetyChecks.forEach(input => { input.checked = false; });
  $('safety').disabled = !searched || blocked;
  $('complete-message').textContent = '';
  $('check-hint').textContent = blocked ? '혼합 위험이 확인됐어요. 함께 버리지 말고 선생님에게 별도 처리 지시를 받으세요.'
    : searched ? '네 항목을 모두 확인하면 처리 완료 버튼이 활성화됩니다.' : '먼저 시약 정보를 검색하세요.';
  updateComplete();
}
function search(query) {
  $('query').value = query;
  const reagent = findReagent(query);
  searched = Boolean(reagent);
  $('query').setAttribute('aria-invalid', String(!reagent));
  updateSearchSelection(reagent);
  $('result').hidden = !reagent;
  $('search-error').textContent = !query.trim() ? '시약 이름을 입력해 주세요.'
    : !reagent ? '등록되지 않은 시약이에요. 이름을 다시 확인하거나 선생님께 문의하세요.' : '';
  $('details').replaceChildren();
  resetSafety();
  if (!reagent) return;
  $('result-title').textContent = reagent.name;
  $('formula').textContent = reagent.formula;
  for (const [label, key] of [['성질','nature'],['주요 위험','risk'],['섞으면 안 되는 물질 · 일부 예시','incompatible'],['폐수통 확인','waste'],['응급 대처','firstAid']]) {
    const card = document.createElement('div');
    card.className = `detail-card detail-${key}`;
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.textContent = label;
    dd.textContent = reagent[key];
    card.append(dt, dd);
    $('details').append(card);
  }
  $('source').href = reagent.source;
}
function updateSearchSelection(reagent) {
  for (const button of $('examples').querySelectorAll('button')) {
    button.setAttribute('aria-pressed', String(button.textContent === reagent?.name));
  }
}
for (const reagent of REAGENTS) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = reagent.name;
  button.setAttribute('aria-pressed', 'false');
  button.setAttribute('aria-controls', 'result');
  button.addEventListener('click', () => search(reagent.name));
  $('examples').append(button);
  const label = document.createElement('label');
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.value = reagent.name;
  label.append(input, document.createTextNode(reagent.name));
  $('mix-options').append(label);
}
$('search-form').addEventListener('submit', event => { event.preventDefault(); search($('query').value); });
$('query').addEventListener('input', () => {
  searched = false;
  $('query').removeAttribute('aria-invalid');
  updateSearchSelection(null);
  $('result').hidden = true;
  $('search-error').textContent = '';
  resetSafety();
});
$('mix-options').addEventListener('change', () => {
  const selected = [...$('mix-options').querySelectorAll('input:checked')].map(input => findReagent(input.value));
  // 비교 대상을 바꾸면 다시 확인해야 합니다.
  blocked = selected.length > 0;
  $('mix-result').hidden = true;
  resetSafety();
  if (blocked) $('check-hint').textContent = '선택한 시약의 혼합 위험을 먼저 확인하세요.';
});
$('mix-check').addEventListener('click', () => {
  const selected = [...$('mix-options').querySelectorAll('input:checked')].map(input => findReagent(input.value));
  const box = $('mix-result');
  box.replaceChildren();
  box.hidden = false;
  const warnings = evaluateMix(selected);
  blocked = warnings.length > 0 || selected.length === 1;
  box.className = warnings.length ? 'danger' : '';
  const heading = document.createElement('strong');
  heading.textContent = selected.length < 2 ? '시약을 2개 이상 선택해 주세요.' : warnings.length ? '혼합 위험 · 함께 버리지 마세요' : '안전 여부를 판단할 수 없어요';
  box.append(heading);
  if (warnings.length) {
    const list = document.createElement('ul');
    warnings.forEach(message => { const li = document.createElement('li'); li.textContent = message; list.append(li); });
    box.append(list);
  }
  const note = document.createElement('p');
  note.textContent = '대표 경고만 제공해요. 경고가 없어도 혼합을 허용하는 것은 아닙니다. 농도·혼합물·기존 폐액을 선생님과 확인하고 각각 처리하세요.';
  box.append(note);
  resetSafety();
});
$('safety').addEventListener('change', () => { $('complete-message').textContent = ''; updateComplete(); });
$('complete').addEventListener('click', () => {
  updateComplete();
  if ($('complete').disabled) return;
  $('complete-message').textContent = '안전 확인을 완료했어요. 실제 처리는 선생님의 지시를 따르세요. 이 표시는 폐기 사실을 인증하거나 저장하지 않습니다.';
  $('complete').disabled = true;
});
