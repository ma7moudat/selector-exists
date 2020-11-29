import {SelectorExists} from './core/selector-exists';

const html = `
    <section class="component">
        <div class="component-inner">test</div>
    </section>
`;

const css = `
body {
    color: red;
}
section {
    color: green;
}
div {
    color: blue;
}
.component {
    color: pink;
}
.component .component-inner {
    color: yellow;
}
.component-inner .component,
.somehting-else {
    color: purple;
}
.non-existing {
    color: magenta;
}
@media screen {
    .component {
        color: gold;
    }
}
@supports(display: grid) {
    .component-inner {
        color: lightblue;
    }
}
`;

const instance = new SelectorExists({
    html,
    css,
});

instance.report();
