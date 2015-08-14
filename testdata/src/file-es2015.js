import ignored from './ignored-es2015';

export default function fileAsES2015(x) {
  if (x < 0)
    x = -x;

  return x * x;
}
