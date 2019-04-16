const createTextElement = (text: string): DeactElement =>
  createElement("TEXT ELEMENT", {
    nodeValue: text
  });

const createElement = (
  type: string | DeactComponent,
  config: { [key: string]: any },
  ...args: Array<string | DeactElement>
): DeactElement => {
  const children: Array<DeactElement> =
    args.length > 0
      ? args.map(e => (typeof e === "string" ? createTextElement(e) : e))
      : null;

  const props: Props = Object.assign({}, config, {
    children
  });

  let element = <DeactElement>{};
  element.type = type;
  element.props = props;

  return element;
};

export default createElement;
