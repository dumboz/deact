(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Deact = {}));
}(this, function (exports) { 'use strict';

  var createTextElement = function (text) {
      return createElement("TEXT ELEMENT", {
          nodeValue: text
      });
  };
  var createElement = function (type, config) {
      var args = [];
      for (var _i = 2; _i < arguments.length; _i++) {
          args[_i - 2] = arguments[_i];
      }
      var children = args.length > 0
          ? args.map(function (e) { return (typeof e === "string" ? createTextElement(e) : e); })
          : null;
      var props = Object.assign({}, config, {
          children: children
      });
      var element = {};
      element.type = type;
      element.props = props;
      return element;
  };

  var isIntristicInstance = function (instance) {
      return typeof instance.element.type === "string";
  };
  var isIntristicElement = function (element) {
      return typeof element.type === "string";
  };
  var updateDomProperties = function (dom, oldProps, newProps) {
      var isEvent = function (name) { return name.startsWith("on"); };
      var isProperty = function (name) { return !isEvent(name) && name !== "children"; };
      Object.keys(oldProps)
          .filter(isEvent)
          .forEach(function (name) {
          var eventType = name.toLowerCase().slice(2);
          dom.removeEventListener(eventType, oldProps[name]);
      });
      Object.keys(oldProps)
          .filter(isProperty)
          .forEach(function (name) {
          dom[name] = null;
      });
      Object.keys(newProps)
          .filter(isEvent)
          .forEach(function (name) {
          var eventType = name.toLowerCase().slice(2);
          dom.addEventListener(eventType, newProps[name]);
      });
      Object.keys(newProps)
          .filter(isProperty)
          .forEach(function (name) {
          dom[name] = newProps[name];
      });
  };
  var releaseInstance = function (instance) {
      if (isIntristicInstance(instance)) {
          updateDomProperties(instance.dom, instance.element.props, {});
          var childInstances = instance.childInstances;
          childInstances.forEach(function (childInstance) { return releaseInstance(childInstance); });
      }
      else {
          releaseInstance(instance.childInstance);
      }
  };

  var currentlyRenderedInstance = null;
  var instanceState = new WeakMap();
  var count = 0;
  var useState = function (initState) {
      if (!instanceState.get(currentlyRenderedInstance)[count]) {
          var setState = (function (count) { return function (state) {
              instanceState.get(currentlyRenderedInstance)[count][0] = state;
              reconcile(currentlyRenderedInstance.dom.parentElement, currentlyRenderedInstance, currentlyRenderedInstance.element);
          }; })(count);
          instanceState.get(currentlyRenderedInstance)[count] = [initState, setState];
      }
      var res = instanceState.get(currentlyRenderedInstance)[count];
      count++;
      return res;
  };
  var setCurrentlyRenderedInstance = function (instance) {
      currentlyRenderedInstance = instance;
      if (!instanceState.has(currentlyRenderedInstance)) {
          instanceState.set(currentlyRenderedInstance, []);
      }
      count = 0;
  };

  var instantiate = function (element) {
      if (!element) {
          return null;
      }
      if (isIntristicElement(element)) {
          var dom_1 = element.type === "TEXT ELEMENT"
              ? document.createTextNode("")
              : document.createElement(element.type);
          updateDomProperties(dom_1, {}, element.props);
          var childElements = element.props.children || [];
          var childInstances = childElements.map(instantiate);
          childInstances
              .filter(function (c) { return !!c; })
              .forEach(function (childInstance) {
              dom_1.appendChild(childInstance.dom);
          });
          var instance = {};
          instance.dom = dom_1;
          instance.element = element;
          instance.childInstances = childInstances;
          return instance;
      }
      else {
          var instance = {};
          setCurrentlyRenderedInstance(instance);
          var childElement = element.type(element.props);
          var childInstance = instantiate(childElement);
          if (!childInstance) {
              return null;
          }
          instance.dom = childInstance.dom;
          instance.element = element;
          instance.childInstance = childInstance;
          return instance;
      }
  };

  var reconcile = function (parentDom, instance, element, pos) {
      if (pos === void 0) { pos = null; }
      if (!instance && !element) {
          return null;
      }
      else if (!instance) {
          var nextInstance = instantiate(element);
          parentDom.insertBefore(nextInstance.dom, pos);
          return nextInstance;
      }
      else if (!element) {
          parentDom.removeChild(instance.dom);
          releaseInstance(instance);
          return null;
      }
      else if (instance.element.type !== element.type) {
          var nextInstance = instantiate(element);
          parentDom.replaceChild(nextInstance.dom, parentDom.lastElementChild);
          return nextInstance;
      }
      else if (isIntristicInstance(instance)) {
          updateDomProperties(instance.dom, instance.element.props, element.props);
          instance.element = element;
          var oldChildInstances = instance.childInstances;
          var childElements = element.props.children || [];
          var childInstances = [];
          var count = Math.max(oldChildInstances.length, childElements.length);
          for (var i = 0; i < count; i++) {
              var insertPos = null;
              for (var insertIdx = i; insertIdx < oldChildInstances.length; insertIdx++) {
                  if (oldChildInstances[insertIdx] && oldChildInstances[insertIdx].dom) {
                      insertPos = oldChildInstances[insertIdx].dom;
                      break;
                  }
              }
              var childInstance = reconcile(instance.dom, oldChildInstances[i], childElements[i], insertPos);
              childInstances.push(childInstance);
          }
          instance.childInstances = childInstances;
          return instance;
      }
      else {
          setCurrentlyRenderedInstance(instance);
          instance.element = element;
          var childElement = instance.element.type(instance.element.props);
          var oldChildInstance = instance.childInstance;
          var childInstance = reconcile(parentDom, oldChildInstance, childElement);
          instance.dom = childInstance.dom;
          instance.childInstance = childInstance;
          return instance;
      }
  };

  var rootInstance = null;
  var render = function (element, parentDom) {
      var nextInstance = reconcile(parentDom, rootInstance, element);
      rootInstance = nextInstance;
  };

  exports.createElement = createElement;
  exports.render = render;
  exports.useState = useState;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=index.js.map
