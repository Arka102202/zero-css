# zero-css

It is css library that uses classes to add style to any element.

## List of possible class name

- if somethings are within `[]` ==> that value is optional.
- if somethings are within `{}` ==> that means any or all of the value can be used.
- if somethings are within `()` ==> that means only one of the value can be used.
- any and every length units can be used like `px, rem, em, %, vw, vh`.

### Class name for size

- `[max/min]_(wd/ht/size)-[max/min]_[breakpoint]-value_[imp]`
- `aspect_ratio-[max/min]_[breakpoint]-value_[imp]`:
  while providing the value of aspect ratio the `/` should be replaced with a `_`,
  e.g. `aspect_ratio-max_xxl-3-4` which means the value of the aspect ratio will be `3/4`.

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
