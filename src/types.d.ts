interface Props {
  [key: string]: any;
  children?: Array<DeactElement>;
}

interface DeactComponentElement {
  type: DeactComponent;
  props: Props;
}

interface DeactIntristicElement {
  type: string;
  props: Props;
}

type DeactElement = DeactComponentElement | DeactIntristicElement;

interface DeactComponent {
  (props: Props): DeactElement;
}

interface DeactComponentInstance {
  dom: HTMLElement | Text;
  element: DeactElement;
  childInstance: DeactInstance;
}

interface DeactIntristicInstance {
  dom: HTMLElement | Text;
  element: DeactElement;
  childInstances: Array<DeactInstance>;
}

type DeactInstance = DeactComponentInstance | DeactIntristicInstance;
