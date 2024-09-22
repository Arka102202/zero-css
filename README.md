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

for the ease of writing I have created some `key:value` mappings for different property values. The `key` should be used to provide the values of the corresponding property.

***If some values are omitted that means that particular value can be used as it is.***
***If some values are declared here then that has to be in the following manner.***

=> `justify and align`:

``` js
const layoutAlignments = {
  c: "center",
  fs: "flex-start",
  fe: "flex-end",
  s: "start",
  e: "end",
  left: "left",
  right: "right",
  sb: "space-between",
  sa: "space-around",
  se: "space-evenly",
  stretch: "stretch",
  b: "baseline",
  fb: "first baseline",
  lb: "last baseline"
}
```

=> `Flex direction`:

``` js
const flexDir = {
  rowR: "row-reverse",
  col: "column",
  colR: "column-reverse"
}
```

=> `Flex wrap`:

``` js
const flexWrap = {
  wrapR: "wrap-reverse",
}
```

=> `Position`:

``` js
const position = {
  rel: "relative",
  abs: "absolute",
  fix: "fixed",
}
```

=> `side or direction`:

``` js
const sides = {
  t: "top",
  r: "right",
  b: "bottom",
  l: "left",
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left"
}
```

-- **Display Classes**:

- `d-[max/min]_[breakpoint]-(block/inline/inline-block/flex/grid/none)`
- `d-[max/min]_[breakpoint]-flex_[flexDirection]_justifyVal_alignVal_gapVal`
- `d-[max/min]_[breakpoint]-grid_justifyVal_alignVal`

-- **FLex Classes**:

- `flex_(dir/grow/shrink/wrap)-[max/min]_[breakpoint]-value`
- `flex-[max/min]_[breakpoint]-{grow_shrink_basis}`
- `flex_child-[max/min]_[breakpoint]-(even/fixed_wd/auto)`

-- **Grid Classes**:

- `grid-[max/min]_[breakpoint]-col_colCount_r_colWidth_(g/cg)_gapValue`:
here `r` after the `colCount` is to denote `repeat`-function.
- `grid-[max/min]_[breakpoint]-col_colWidth1_colWIdth2_....`
- `grid-[max/min]_[breakpoint]-col_span_(to_from/spanValue)`

- `grid-[max/min]_[breakpoint]-row_colCount_r_colWidth`:
here `r` after the `colCount` is to denote `repeat`-function.
- `grid-[max/min]_[breakpoint]-row_colWidth1_colWIdth2_....`
- `grid-[max/min]_[breakpoint]-row_span_(to_from/spanValue)`

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
