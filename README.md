
### &lt;ramachandran-component&gt;

This component is for interactive visualisation of ramachandram plots.

### Try it

Working example is in `build` folder.

Put this to your html file:

```
<link href="static/css/rama-component.css" rel="stylesheet">
<script type="text/javascript" src="static/js/rama-component.js">
<div id="rama-root"/>
```

Use:
```
<script>const element = document.getElementById('rama-root');
    const pdb = '1tqn';
    const chainsToShow = ['A'];
    const modelsToShow = [1];
    renderRamaComp(element, pdb, chainsToShow, modelsToShow);
</script>
```
