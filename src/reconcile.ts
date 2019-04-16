import instantiate from "./instantiate";
import {
  releaseInstance,
  isIntristicInstance,
  updateDomProperties
} from "./utils";
import { setCurrentlyRenderedInstance } from "./useState";

const reconcile = (
  parentDom: HTMLElement,
  instance: DeactInstance,
  element: DeactElement,
  pos: Node = null
): DeactInstance => {
  if (!instance && !element) {
    return null;
  } else if (!instance) {
    const nextInstance = instantiate(element);
    parentDom.insertBefore(nextInstance.dom, pos);
    return nextInstance;
  } else if (!element) {
    parentDom.removeChild(instance.dom);
    releaseInstance(instance);
    return null;
  } else if (instance.element.type !== element.type) {
    const nextInstance = instantiate(element);
    parentDom.replaceChild(nextInstance.dom, parentDom.lastElementChild);
    return nextInstance;
  } else if (isIntristicInstance(instance)) {
    updateDomProperties(instance.dom, instance.element.props, element.props);
    instance.element = element;

    const oldChildInstances = instance.childInstances;
    const childElements = element.props.children || [];

    let childInstances = [];

    const count = Math.max(oldChildInstances.length, childElements.length);

    for (let i = 0; i < count; i++) {
      let insertPos = null;

      for (let insertIdx = i; insertIdx < oldChildInstances.length; insertIdx ++ ){
        if (oldChildInstances[insertIdx] && oldChildInstances[insertIdx].dom) {
          insertPos = oldChildInstances[insertIdx].dom;
          break;
        }
      } 

      const childInstance = reconcile(
        <HTMLElement>instance.dom,
        oldChildInstances[i],
        childElements[i],
        insertPos
      );
      childInstances.push(childInstance);
    }

    instance.childInstances = childInstances;

    return instance;
  } else {
    setCurrentlyRenderedInstance(instance);
    instance.element = <DeactComponentElement>element;
    const childElement = instance.element.type(instance.element.props);
    const oldChildInstance = instance.childInstance;
    const childInstance = reconcile(parentDom, oldChildInstance, childElement);
    instance.dom = childInstance.dom;
    instance.childInstance = childInstance;
    return instance;
  }
};

export default reconcile;
