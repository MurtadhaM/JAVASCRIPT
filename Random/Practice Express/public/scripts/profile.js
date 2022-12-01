const root = document.documentElement;
const card = document.querySelector("#card");
const btn = document.querySelector("#btn");
const cubes = document.querySelectorAll(".cube");
const schema = {
  schema0: {
    s1: "#000A52",
    s2: "#031067",
    s3: "#D33F49"
  },
  schema1: {
    s1: "#082172",
    s2: "#09278a",
    s3: "#456990"
  },
  schema2: {
    s1: "#4F3FB2",
    s2: "#5844d2",
    s3: "#2BCAC7"
  }
};
let createCube = (e) => {
  card.innerHTML = "";
  let s = Math.floor(Math.random() * 3);

  for (var i = 0; i < 28; i++) {
    setTimeout(() => {
      root.style.setProperty("--c1", schema[`schema${s}`].s1);
      root.style.setProperty("--c2", schema[`schema${s}`].s2);
      root.style.setProperty("--c3", schema[`schema${s}`].s3);
      let n = Math.floor(Math.random() * 8) + 1;
      let newCube = documksent.createElement("div");
      newCube.className = `cube cube--${n}`;
      card.appendChild(newCube);
    }, 15 * i);
  }
};
btn.addEventListener("click", createCube);
createCube();
