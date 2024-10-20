import 'katex/dist/katex.min.css';
import LatexComponent from 'react-latex-next';

export const Latex = ({ children }) => {
  console.log(children);
  return <LatexComponent>{children}</LatexComponent>;
};
