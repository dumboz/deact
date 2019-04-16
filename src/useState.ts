import reconcile from "./reconcile";

let currentlyRenderedInstance: DeactInstance = null;

const instanceState = new WeakMap<DeactInstance, Array<any>>();

let count = 0;

const useState = (initState: any) => {
  if (!instanceState.get(currentlyRenderedInstance)[count]) {
    const setState = (count => (state: any) => {
      instanceState.get(currentlyRenderedInstance)[count][0] = state;
      reconcile(
        currentlyRenderedInstance.dom.parentElement,
        currentlyRenderedInstance,
        currentlyRenderedInstance.element
      );
    })(count);

    instanceState.get(currentlyRenderedInstance)[count] = [initState, setState];
  }

  const res = instanceState.get(currentlyRenderedInstance)[count];

  count++;

  return res;
};

export const setCurrentlyRenderedInstance = (instance: DeactInstance) => {
  currentlyRenderedInstance = instance;

  if (!instanceState.has(currentlyRenderedInstance)) {
    instanceState.set(currentlyRenderedInstance, []);
  }

  count = 0;
};

export default useState;
