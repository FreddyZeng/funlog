export interface Cat {
  getName(name: string): string;
}


// NOTE: this whole class is an implementation detail and is not exported
class CatImpl implements Cat {

name: string;

constructor() {
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 11, column: 14");
}


getName(name: string) {
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 16, column: 22");

  return this.name;
}
}

// this is exported and is publicly available for creating Cats
export function createCat(): Cat {
  console.log("path: /home/fanrong/funlog/test/file/test2.ts, line: 23, column: 33");

  return new CatImpl();
}