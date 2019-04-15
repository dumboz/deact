import reconcile from "./reconcile";

let rootInstance: DeactInstance = null;

const render = (element: DeactElement, parentDom: HTMLElement) => {
  const nextInstance = reconcile(parentDom, rootInstance, element);
  rootInstance = nextInstance;
};

export default render;
