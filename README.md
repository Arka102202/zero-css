# <p align="center">ZERO CSS - A fully-dynamic, class-based CSS library</p>

<div align="center"><img src="./Zero-Css.svg" alt="My library logo" width="400px"></div>

## **What is a CSS library?**

  There is no formal definition of a `CSS library`, but looking at the popular CSS library we can define it in the following manner -
  it is a collection of `pre-written`, `highly-reusable` CSS `Class-based` rules that help developers to style any HTML elements `quickly` and `consistently` throughout a website. These libraries promote adherence to the DRY ("Don't Repeat Yourself") principle, streamlining development by eliminating redundant code and reducing the time and effort required to maintain a cohesive design system.

## Two Types of CSS Classes in Libraries

1. Utility Classes<br>
  These are highly specific classes that target individual aspects of an element's appearance, like margin, padding, text alignment, or background color. They provide fine-grained control, allowing developers to combine various utility classes to create a custom look for each element.

  > Example (from Tailwind CSS):

  ```HTML
  <div class="bg-blue-500 text-white p-4">
    A box with background, text color, and padding
  </div>
  ```

2. Component Classes<br>
  These are classes designed to style entire elements or components, such as buttons, cards, or forms, in one go. They abstract away detailed styling, offering a fully-styled version of the element or component.

  > Example (from Bootstrap):

  ```HTML
  <button class="btn btn-primary">Primary Button</button>
  ```

## Now let's come to My Library

Introducing `ZERO CSS`, the most advanced and groundbreaking CSS library ever conceived. `ZERO CSS` redefines the boundaries of what a CSS library can be. Unlike traditional libraries, `ZERO CSS` `doesn't rely on pre-defined classes`. Instead, every `class is dynamically generated on the client side`, in real-time, as developers apply them to HTML elements.

This innovative approach empowers developers with unparalleled flexibility and performance, creating a truly on-demand styling experience. By shifting CSS generation to the client-side, `ZERO CSS` unlocks capabilities that no other library can match.

`ZERO CSS` is not just a tool — it's a `paradigm shift in CSS development`, comparable to the transformation React brought to JavaScript. Its instant adaptability and real-time styling power deliver performance and versatility that traditional libraries simply cannot replicate, pushing the boundaries of what’s possible in modern web development.

## The Unmatched Superpowers of ZERO CSS: How It Stands Above All Other Libraries

### `ZERO CSS` is the epitome of true dynamism

  While other libraries might define `dynamic` within rigid boundaries, `ZERO CSS` shatters those limitations. Here, `dynamic` means `absolute freedom` — the ability to apply any value to any property, without constraints.

  > Example: Whether it's `wd-10%`, `wd-12.5vw`, `border_rad-2.4vw+2.4%+10px+2rem`, or `color-red`, developers can seamlessly use any unit — `px, rem, em, %, vw, vh` — with any value, from decimals like `1.2` and `11.56` to more complex combinations(with the upcoming updates).

  Sure, other libraries may claim to support flexibility, but they require pre-definition in a config file, limiting developers to a pre-set range of values. What they call `dynamic` is just controlled variability — it’s far from the real-time, unrestricted power that `ZERO CSS` delivers.

  With `ZERO CSS`, **there are no predefined limits. It’s not just flexible—it’s truly `dynamic`**.

### Set Your Own Standards to provide a Truly Customized Web Experience

  CSS variables are one of the most powerful tools in modern web design, offering unparalleled flexibility to customize a website’s look and feel. Traditionally, developers must manually define these variables, but `ZERO CSS` takes this to a whole new level, making customization seamless and intuitive.

  Unlike other libraries, which don't even offer the ability to create your own CSS variables, `ZERO CSS` empowers developers to define them effortlessly. With `ZERO CSS`, you don’t even need to know how CSS variables work.

  With `ZERO CSS` developers can create CSS variables in one of the following two ways:

  1. using utility class:<br>

  The CSS class that lets developer create new CSS variables, looks like `vars_[selector]-[max/min]_[breakPoints]@var1:val,var2:val,.....`.
  The class must start with `vars` and the `[selector]` is a placeholder - that can be replaced with different selectors like - `html`, `:root`, `.class_name`,
  `#id` or anything that is a valid CSS selector. The name of variables should be camelCased i.e. `primaryClr` and that will be added as `--primary-clr` and after the `:` provide the suitable value which must not contain any space.

  > Example <br> <body class="vars_html@flexDir:column&blue:blue&bgImg:url('https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg')&textGrad:linear-gradient(90deg,rgba(2,0,36,1)0%,rgba(9,9,121,1)35%,rgba(0,212,255,1)100%)"></body> 

  this will be added to the CSS as

  ```css
  :root {
    --flex-dir: column;
    --blue: blue;
    --bg-img: url(https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg);
    --text-grad: linear-gradient(90deg, rgba(2, 0, 36, 1) 0%, rgba(9, 9, 121, 1) 35%, rgba(0, 212, 255, 1) 100%);
  }
  ```

```js
const vars = {
        "mainWidth": "80%",
        "flexGap": "1rem",
        "flexDir": "row",
        "firstCol": "1fr",
        "spanVal": "2/4",
        "textGrad": "linear-gradient(90deg,rgba(2,0,36,1)0%,rgba(9,9,121,1)35%,rgba(0,212,255,1)100%)",
        "bgImg": "url('https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg')"
    }
```

In your HTML, simply use:

```HTML
  <div class="vars_e_html::${JSON.stringify(vars)}"></div>
```

The `vars_e_html::${JSON.stringify(vars)}` will automatically inject all key-value pairs as CSS variables, giving you complete control over your site’s design with zero hassle.

With `ZERO CSS`, setting **your own standards is easier, faster, and more powerful than ever before—delivering a next-level customization experience unmatched by any other library**.

### It's not tiny, It's NULL

  Unlike traditional CSS libraries that come bloated with pre-defined classes and rely on purging unused styles after the fact, `ZERO CSS` takes a revolutionary approach. Instead of generating a separate CSS file, `ZERO CSS` dynamically creates all classes at runtime. This means there’s nothing to purge—ever.

  By adhering to the DRY (Don't Repeat Yourself) principle at its core, `ZERO CSS` ensures that no CSS class is redundantly generated or evaluated more than once. **Every class is unique, and no code duplication occurs**.

  The real power of this approach? No CSS file is ever shipped across the network. Traditional libraries may boast of tiny, purged CSS files, but with `ZERO CSS`, there’s no file at all—it's fully dynamic. This leads to drastically improved site performance, as no bandwidth is wasted on delivering or caching static CSS files.

  With `ZERO CSS`, **you unlock the next level of CSS optimization: zero redundancy, zero purging, zero files—delivering a leaner, faster web experience**.

### Effortless, Pixel-Perfect Adaptation for Every Screen Size

### Unleash the Power of Flexbox and Grid

### Craft Custom Classes to Keep Your Code DRY and Stylish

### Full Selector & Combinator Integration for True Styling Freedom

### Say Goodbye to Clutter: Embrace Compact CSS with Pseudo Classes & Elements

### Pro-Level Styling: Stack Backgrounds & Shadows

### Elevate Your Typography: Simple Online Font Importing

## Some rules before use start using this awesome Library

- if somethings are within `[]` ==> that value is optional.
- if somethings are within `{}` ==> any or all of the value can be used.
- if somethings are within `()` ==> only one of the value can be used.
- any and every length units can be used like `px, rem, em, %, vw, vh`.

## List of possible class name and How to use them

### Class name for size

- `[max/min]_(wd/ht/size)-[max/min]_[breakpoint]-value_[imp]`
- `aspect_ratio-[max/min]_[breakpoint]-value_[imp]`:
  while providing the value of aspect ratio the `/` should be replaced with a `_`,
  e.g. `aspect_ratio-max_xxl-3_4` which means the value of the aspect ratio will be `3/4`.

### Class name for layout

-- **Display Classes**:

- `d-[max/min]_[breakpoint]-(block/inline/inline-block/flex/grid/none)`
- `d-[max/min]_[breakpoint]-type:(flex/grid)&[flexDir:val]&justify:val&align:val&gap:val`

-- **FLex Classes**:

- `flex-[max/min]_[breakpoint]-{grow_shrink_basis}`
- `flex_(dir/grow/shrink/wrap)-[max/min]_[breakpoint]-value`
- `flex_child-[max/min]_[breakpoint]-(even/fixed_wd/auto)`

-- **Grid Classes**:

- `grid-[max/min]_[breakpoint]-(col/row):Width&re:count&[gap/cGap/rGap]:value`
- `grid-[max/min]_[breakpoint]-(col/row):width1,width2,....`
- `grid-[max/min]_[breakpoint]-(col/row)Span:(to,from/value)`
- `grid-col_(auto-fit/auto-fill)_10(vw/vh/px/rem)`

-- **Justify Classes**:

- `justify_(content/items/self)-[max/min]_[breakpoint]-value`

-- **Align Classes**:

- `align_(content/items/self)-[max/min]_[breakpoint]-value`

-- **Gap Classes**:

- `[col/row]_gap_(content/items/self)-[max/min]_[breakpoint]-value`

-- **Order Classes**:

- `order-[max/min]_[breakpoint]-value`

-- **Position Classes**:

- `pos-[max/min]_[breakpoint]-value`

-- **overflow Classes**:

- `overflow-[max/min]_[breakpoint]-value`

-- **zIndex Classes**:

- `zIndex-[max/min]_[breakpoint]-value`

-- **top/right/bottom/left Classes**:

- `(top/right/bottom/left)-[max/min]_[breakpoint]-value`

-- **Center element Classes**:

- `center_el-[max/min]_[breakpoint]-(c/t/r/b/l)_(abs/fix)`
- `align_(left/right/top/bottom)-[max/min]_[breakpoint]-(abs/fix)_value`

### Spacing Classes

-- **Padding and Margin Classes**

- `(p/m)_[x/y/t/r/b/l]-[max/min]_[breakpoint]-value`
- `(p/m)-[max/min]_[breakpoint]-valueX_valueY`

### Border Classes

-- **Padding and Margin Classes**

- `border_[t/r/b/l]-[max/min]_[breakpoint]-{wd:val&st:va&clr:val}`
- `border_[t/r/b/l]_[wd/st/clr/off]-[max/min]_[breakpoint]-value`

- `border_rad_[tr/br/bl/tl]_[max/min]_[breakpoint]-value`

- `outline_[t/r/b/l]-[max/min]_[breakpoint]-{wd:val&st:va&clr:val&off:val}`
- `outline_[t/r/b/l]_[wd/st/clr/off]-[max/min]_[breakpoint]-value`

- `ring_[t/r/b/l]-[max/min]_[breakpoint]-{wd:val&clr:val}`

### Background Classes

-- **Background Classes**

- `bg-[max/min]_[breakpoint]-{clr:val&img:val&pos:val&s:val&re:val&org:val&clip:val&att:val}`
- `bg_(color/image/position/size/repeat/origin/clip/attachment)-[max/min]_[breakpoint]-value`

### Typography Classes

-- **Font Classes**

- `font-[max/min]_[breakpoint]-{st:val&weight:val&s:val&family:val}`

- `font_family-name-1,name-2,nameDifferent`:
rule to use font-family name:
  - `Roboto Condensed` ==> `Roboto+Condensed`.
  - `sans serif` ==> `sans#serif`.

- `font_[style/weight/size]-[max/min]_[breakpoint]-value`

-- **Letter Classes**

- `letter_space-[max/min]_[breakpoint]-value`
- `letter_dir-[max/min]_[breakpoint]-value`:
the values of letter direction are `up`, `down`, `right`, `left`.

-- **Line Classes**

- `line_(height/clamp/break)-[max/min]_[breakpoint]-value`

-- **Text Classes**

- `txt_decor-[max/min]_[breakpoint]-type_color_style_thick`
- `txt_decor_[type/color/style/thick]-[max/min]_[breakpoint]-value`
- `txt_underline_offset-[max/min]_[breakpoint]-value`
- `txt_transform-value`

-- **Font color Class**

- `color-[max/min]_[breakpoint]-value`

-- **Font import Class**

- `@import-value`

### Effect Classes

-- **Filter and backdrop-filter Classes**

- `filter-[max/min]_[breakpoint]-{blur:val&brightness:val&dropShadow:val&....}`
- `filter_(blur/brightness/contrast/shadow/gray/hue/invert/sat/sepia/dropShadow)-[max/min]_[breakpoint]-value`
- `bdFilter-[max/min]_[breakpoint]-{blur:val&brightness:val&....}`
- `bdFilter_(blur/brightness/contrast/shadow/gray/hue/invert/sat/sepia)-[max/min]_[breakpoint]-value`

-- **Mix and Background Blend Classes**

- `(mix/bg)_blend-[max/min]_[breakpoint]-value`

-- **Opacity Classes**

- `opacity-[max/min]_[breakpoint]-value`

-- **Shadow Classes**

- `shadow-[max/min]_[breakpoint]-value`

-- **Text Gradient Classes**

- `text_grad-[max/min]_[breakpoint]-value`
