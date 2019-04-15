export const isIntristicInstance = (
  instance: DeactInstance
): instance is DeactIntristicInstance => {
  return typeof instance.element.type === "string";
};

export const isIntristicElement = (
  element: DeactElement
): element is DeactIntristicElement => {
  return typeof element.type === "string";
};

export const updateDomProperties = (
  dom: HTMLElement | Text,
  oldProps: Props,
  newProps: Props
) => {
  const isEvent = (name: string) => name.startsWith("on");
  const isProperty = (name: string) => !isEvent(name) && name !== "children";

  Object.keys(oldProps)
    .filter(isEvent)
    .forEach(name => {
      const eventType = name.toLowerCase().slice(2);
      dom.removeEventListener(eventType, oldProps[name]);
    });

  Object.keys(oldProps)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = null;
    });

  Object.keys(newProps)
    .filter(isEvent)
    .forEach(name => {
      const eventType = name.toLowerCase().slice(2);
      dom.addEventListener(eventType, newProps[name]);
    });

  Object.keys(newProps)
    .filter(isProperty)
    .forEach(name => {
      dom[name] = newProps[name];
    });
};

export const releaseInstance = (instance: DeactInstance) => {
  if (isIntristicInstance(instance)) {
    updateDomProperties(instance.dom, instance.element.props, {});
    const childInstances = instance.childInstances;
    childInstances.forEach(childInstance => releaseInstance(childInstance));
  } else {
    releaseInstance(instance.childInstance);
  }
};
