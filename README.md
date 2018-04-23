
##&lt;ramachandran-component&gt;

This component is for interactive visualisation of ramachandram plots.

### Try it

Working example is in `build` folder.

Put this to your html file:

```
<link href="static/css/rama-component.css" rel="stylesheet">
<script type="text/javascript" src="static/js/rama-component.js">
<div id="rama-root">
```

Use:
```
<ramachandran-component pdbid="'3d12'" chainstoshow="['A', 'D', 'B']" modelstoshow="[1, 2]"></ramachandran-component>
```