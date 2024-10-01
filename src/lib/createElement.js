// TODO: createElement 함수 구현
// 1. vNode가 falsy면 빈 텍스트 노드를 반환합니다.
// 2. vNode가 문자열이나 숫자면 텍스트 노드를 생성하여 반환합니다.
// 3. vNode가 배열이면 DocumentFragment를 생성하고 각 자식에 대해 createElement를 재귀 호출하여 추가합니다.
// 4. vNode.type이 함수면 해당 함수를 호출하고 그 결과로 createElement를 재귀 호출합니다.
// 5. 위 경우가 아니면 실제 DOM 요소를 생성합니다:
//    - vNode.type에 해당하는 요소를 생성
//    - vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
//    - vNode.children의 각 자식에 대해 createElement를 재귀 호출하여 추가
/** @jsx createVNode */
import { createVNode } from './createVNode';

export function createElement(vNode) {

  if(typeof vNode === 'string' || typeof vNode === 'number'){
    return document.createTextNode(vNode);
  }

  if(!vNode || typeof vNode === 'boolean'){
    return document.createTextNode('');
  }

  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    vNode.forEach(child => fragment.appendChild(createElement(child)));
    return fragment;
  }
  
  if (typeof vNode.type === 'function') {
    return createElement(vNode.type(vNode.props || {}))
  }

  const element = document.createElement(vNode.type);

  if(vNode.props) {
    Object.entries(vNode.props).forEach(([key, value]) => {
      if(key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.slice(2).toLowerCase(), value);
      }else if (key === 'className') {
        element.className = value;
      }else if (key === 'style' && typeof value === 'object' && value) {
        Object.assign(element.style, value);
      }else {
        if(key in element) {
          element[key] = value;
        } else{
          element.setAttribute(key, value);
        }
      }
    });
  }

  if (vNode.children) {
    const fragment = document.createDocumentFragment();
    vNode.children.forEach(child => {
      fragment.appendChild(createElement(child));
    })
    element.appendChild(fragment);
  }

  return element
}