
  export default function debounceFc(func: Function, delay: number): (...args: any[]) => void {
    let timer: NodeJS.Timeout;
    
    return function(this: any, ...args: any[]) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  