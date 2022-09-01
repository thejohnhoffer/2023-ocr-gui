const navTemplate = (inputs) => {
  const { stepBack, stepHome } = inputs;
  const { resetter, uuid, labels } = inputs.node;
  const slash = '<div class="slash">/</div>'
  const handlers = labels.map((label, i, a) => {
    const range = [...new Array(a.length - i).keys()]; 
    const action = () => {
      if (resetter) resetter(i);
      range.map(stepBack);
    }
    const fn = i > 0 ? action : stepHome;
    const id = `${uuid}-nav-${i}`;
    const data = { label };
    return { data, id, fn };
  });
  const items = handlers.map(({ data, id }) => {
    return `<div><span id="${id}">${data.label}</span></div>`;
  }).join(slash);
  const id = `${uuid}-go-back`;
  const cls = "wrap-nav";
  const props = [
    `class="${cls}"`,
    `id="${id}"`
  ].join(' ');
  const html = `<div ${props}>${items}</div>`;
  return { html, handlers };
}

const modalTemplate = (inputs) => {
  const { hideModal } = inputs;
  const { uuid, message } = inputs.node;
  const { copy, simple, error } = inputs.node;
  const color = ["dark-pink", "black-blue"][+!error];
  const content = `<div>${message}</div>`;
  const close_id = `${uuid}-modal-close`;
  const handlers = [{id: close_id, fn: hideModal}];
  let copy_button = "";
  if (copy) {
    const id = `${uuid}-modal-copy`;
    const fn = () => {
      navigator.clipboard.writeText(copy);
      if (simple) hideModal();
    }
    const props = `class="dark-blue" id="${id}"`;
    copy_button = `<button ${props}>Copy</button>`;
    handlers.push({id, fn});
  }
  const close_props = `id="${close_id}" class="dark-pink"`;
  const close_button = `<button ${close_props}>close</button>`
  const core = `<div class="${color}">
    <div>${content}${copy_button}</div>
    ${simple ? "" : close_button}
  </div>`;
  const html = `<div class="wrap-modal">${core}</div>`;
  return { html, handlers };
}

const formTemplate = (inputs) => {
  const passFormId = "pass-form";
  const { uuid, title } = inputs.node;
  const { reset, loading } = inputs.node;
  const id = `${uuid}-form-login`;
  const u_id = "u-root";
  const p_id = "password-input";
  const user_auto = 'readonly="readonly" autocomplete="username"';
  const user_props = `id="${u_id}" value="root" ${user_auto}`;
  const pwd_auto = 'autocomplete="current-password"';
  const pwd_props = `id="${p_id}" ${pwd_auto}`;
  const b_cls = ["true-pink", "true-blue"][+!reset];
  const b_txt = ["Reset", "Log in"][+!reset];
  const i_cls = ["danger", ""][+!reset];
  let new_pwd = "";
  let bottom = `
    <button id="${id}" class="button ${b_cls}">${b_txt}</button>
  `;
  if (loading) {
    bottom = `<div class="loading large-font">
      <div>${title}</div>
    </div>`;
  }
  if (reset) {
    const p_id_new = "new-password-input";
    const new_pwd_auto = 'autocomplete="new-password"';
    const new_pwd_props = `id="${p_id_new}" ${new_pwd_auto}`;
    new_pwd = `
      <label for="${p_id_new}">New Password:</label>
      <input type="password" ${new_pwd_props}>
    `;
  }
  const html = `
  <div class="wrap-shadow">
    <h2 class="center-text">${title}</h2>
    <form id="${passFormId}">
      <label for="${u_id}">Username:</label>
      <input class="${i_cls}" type="text" ${user_props}>
      <label for="${p_id}">Password:</label>
      <input class="${i_cls}" type="password" ${pwd_props}>
      ${new_pwd}
      ${bottom} 
    </form>
  </div>`
  return { html, handlers: [] };
}

const templates = {
  nav: navTemplate,
  form: formTemplate,
  modal: modalTemplate
}

export { templates };
