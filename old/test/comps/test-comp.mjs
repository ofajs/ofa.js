export const type = ofa.COMP;

// export const tag = "test-comp"; // If no set, the file name will be used
// export const temp = "./test-comp.html"; // If this value is not set, the html file with the same name as the tag in the same directory will be used
// export const temp = "../testtemp.html";

export const ready = function () {
  console.log("component ready => ", this);
};

// export default async ({ load }) => {
//   const t = await load("../testtemp.html");

//   console.log("t => ", t);

//   return {
//     ready() {
//       console.log("ready => ", this);
//     },
//   };
// };

export default {
  ready() {
    console.log("component ready => ", this);
  },
  loaded() {
    console.log("component loaded => ", this);
  },
};
