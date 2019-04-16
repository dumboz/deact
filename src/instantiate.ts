import { isIntristicElement, updateDomProperties } from "./utils";
import { setCurrentlyRenderedInstance } from "./useState";

const instantiate = (element: DeactElement): DeactInstance => {
  if (!element) {
    return null;
  }
  if (isIntristicElement(element)) {
    const dom =
      element.type === "TEXT ELEMENT"
        ? document.createTextNode("")
        : document.createElement(element.type);

    updateDomProperties(dom, {}, element.props);

    const childElements = element.props.children || [];
    const childInstances = childElements.map(instantiate);

    childInstances
      .filter(c => !!c)
      .forEach(childInstance => {
        dom.appendChild(childInstance.dom);
      });

    let instance = <DeactIntristicInstance>{};
    instance.dom = dom;
    instance.element = element;
    instance.childInstances = childInstances;
    return instance;
  } else {
    let instance = <DeactComponentInstance>{};
    setCurrentlyRenderedInstance(instance);
    const childElement = element.type(element.props);
    const childInstance = instantiate(childElement);
    if (!childInstance) {
      return null;
    }
    instance.dom = childInstance.dom;
    instance.element = element;
    instance.childInstance = childInstance;
    return instance;
  }
};

export default instantiate;
