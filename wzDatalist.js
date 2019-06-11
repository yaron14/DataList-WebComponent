class WzDatalist extends HTMLElement {
	constructor() {
		super();
		this.shadow = this.attachShadow({ mode: "open" });
		this.myElem = "WZ-DATALIST";
		this.MyStyle = `
      <style>
      * {
        padding: 0;
        margin: 0;
      }
      .container {
        display: none;
      }
      ul {
        list-style-type: none;
        margin-top: 2px;
        background-color: rgba(245, 245, 245);
        padding: 5px 10px;
        border: 1px solid #CCCCCC;
        min-height: inherit;
      }
      li {
        padding: 5px 5px;
        cursor: pointer;
        text-align: right;
        border-bottom: 1px solid #CCCCCC;
      }
      li:last-child {
        border-bottom: none;
      }
      li:hover {
        background-color: #E8E8E8;
      }
      input {
        background-color: white;
        border: none;
        margin-left: 10px;
        vertical-align: middle;
        border-bottom: 1px dashed #aeaeae;
        font-style: italic;
        font-size: 13px;
        padding: 5px;
        color: #8A8383;
      }
      input:focus {
        outline: none;
      }
      .on-focus {
        position: absolute;
        min-height: 250px;
        max-height: 300px;
        max-width: 500px;
        min-width: 200px;
        overflow: auto;
        display: block;
        z-index: 999999;
      }
      </style>
    `;
	}

	listElem(key) {
		if (!key) {
			return this.arr.map(({ ID, Text }) => `<li value="${ID}">${Text}</li>`).join("");
		}
		const termRegex = new RegExp(key, "gi");
		return this.arr
			.filter(({ Text }) => Text.includes(key))
			.map(({ ID, Text }) => `<li value="${ID}">${Text.replace(termRegex, `<strong>${key}</strong>`)}</li>`)
			.join("");
	}

	setData(arr) {
		this.arr = arr;
		if (typeof this.arr !== "object" || !this.arr.length) {
			throw new Error("dataset is not an array of objects or no values in array");
		}
		this.shadow.innerHTML = `
      ${this.MyStyle}
      <input type="text" placeholder="${this.getAttribute("placeholder")}" />
      <div class="container">
        <ul></ul>      
      </div>
    `;
		this.shadow.addEventListener("focus", this.render.bind(this), true);
		this.shadow.addEventListener("keyup", this.render.bind(this));
		this.shadow.querySelector("ul").addEventListener("click", this.fireClick.bind(this));
		document.addEventListener("click", this.closeSuggest.bind(this));
	}

	render(e) {
		if (e.type === "focus" || e.type === "keyup") {
			this.shadow.querySelector("input").value = e.type === "focus" ? "" : e.target.value;
			this.shadow.querySelector("ul").innerHTML = this.listElem(e.target.value);
			this.shadow.querySelector(".container").classList.add("on-focus");
		}
	}

	fireClick(e) {
		if (e.target.nodeName !== "LI") {
			return;
		}
		this.shadow.querySelector(".container").classList.remove("on-focus");
		postMessage({ WzDatalist_GETDATA: e.target.getAttribute("value") });
		this.shadow.querySelector("input").value = "";
	}

	closeSuggest(e) {
		if (e.target.nodeName !== this.myElem) {
			this.shadow.querySelector(".container").classList.remove("on-focus");
		}
	}
}

customElements.define("wz-datalist", WzDatalist);

export default WzDatalist;
