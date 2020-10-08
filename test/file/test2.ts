export interface Cat {
  getName(name: string): string;
}


// NOTE: this whole class is an implementation detail and is not exported
class CatImpl implements Cat {

name: string;

constructor() {
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 11, column: 14");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 11, column: 14");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 11, column: 14");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 11, column: 14");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 11, column: 14");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 11, column: 14");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 11, column: 14");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 11, column: 14");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 11, column: 14");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 11, column: 14");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 11, column: 14");
}


getName(name: string) {
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 25, column: 22");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 24, column: 22");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 23, column: 22");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 22, column: 22");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 21, column: 22");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 20, column: 22");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 19, column: 22");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 18, column: 22");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 17, column: 22");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 16, column: 22");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 16, column: 22");

  return this.name;
}
}

// this is exported and is publicly available for creating Cats
export function createCat(): Cat {
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 42, column: 33");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 40, column: 33");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 38, column: 33");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 36, column: 33");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 34, column: 33");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 32, column: 33");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 30, column: 33");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 28, column: 33");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 26, column: 33");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 24, column: 33");
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 23, column: 33");

  return new CatImpl();
}