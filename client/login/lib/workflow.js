
class Workflow  {

  constructor ({ DATA, API, templates }) {
    this.templates = templates;
    this.DATA = DATA;
    this.api = API;
  }
  get loading () {
    const loaders = Object.entries(this.DATA.loading);
    return loaders.filter(([_, v]) => v);
  }
  get loader () {
    const { loading } = this;
    const { reset } = this.DATA;
    const labels = {
      socket: "Connecting...",
      mailer: "Authorizing...",
      database: "Loading...",
      sending: "Saving...",
    }
    const title = labels[loading[0]?.[0]];
    switch(loading.length) {
      case 0:
        return ["Welcome", "Reset Master?"][+reset];
      case 1:
        return title || "Processing...";
      default:
        return "Processing";
    }
  }

  get nodes () {
    const { step, reset, modal } = this.DATA;
    const resetter = async (i) => {
      if (i !== 1) return;
      this.DATA.reset = true;
    }
    const roots = [
      [{
        reset,
        view: "form",
        title: this.loader,
        loading: this.loading.length > 0,
      }],
      [{
        resetter, view: "nav",
        labels: ["Welcome", "Reset Master?"]
      }]
    ];
    const tree = roots.map(nodes => {
      const main = nodes.map((node) => {
        const uuid = crypto.randomUUID();
        return { ...node, uuid };
      });
      const tail = [];
      if (modal) {
        const view = "modal";
        const uuid = crypto.randomUUID();
        tail.push({...modal, uuid, view });
      }
      return main.concat(tail);
    });
    const len = tree.length;
    const idx = Math.max(0, step);
    return tree[Math.min(idx, len)];
  }
  get render() {
    const { nodes, api, templates } = this;
    const filter = ({ view }) => view in templates;
    const stepBack = this.stepBack.bind(this);
    const stepNext = this.stepNext.bind(this);
    const stepHome = this.stepHome.bind(this);
    const hideModal = this.hideModal.bind(this);
    const shared = { 
      api, stepBack, stepNext, stepHome, hideModal 
    };
    return nodes.filter(filter).reduce((out, node) => {
      const template = templates[node.view];
      const o = template({ ...shared, node });
      const { html, handlers } = out;
      return { 
        html: `${html}\n${o.html}`,
        handlers: handlers.concat(o.handlers)
      }
    }, { html: "", handlers: []});
  }
  hideModal() {
    this.DATA.modal = null;
  }
  stepHome() {
    this.DATA.step = 1;
  }
  stepBack() {
    const { step, last_session_string } = this.DATA;
    if (step === 1) {
      if (!last_session_string) return;
      this.DATA.reset = true;
    }
    this.DATA.step = Math.floor(step/2);
  }
  stepNext(bool) {
    const { step } = this.DATA;
    this.DATA.step = 2 * step + bool;
  }
}

export { Workflow }
