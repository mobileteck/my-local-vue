enyo.kind({
    name: "SearchInput",
    kind: "onyx.InputDecorator",
    handlers: {
    },
    published: {
        placeholder: "",
        value: ""
    },
    events: {
        onInputChanged: "",
        onInputClear: ""
    },
    components:[
        { name: "inputField", kind: "onyx.Input", style: "height: 30px;", selectOnFocus: false, defaultFocus: true, onchange: "inputChanged", onkeyup: "inputChanged", onclear: "inputChanged"},
        { name: "image", kind: "Image", src: "assets/search-input-search.png", ontap: "reset"}
    ],
    create: function(){
        this.inherited(arguments);
        this.placeholderChanged();
    },

    resize: function(width){
    	this.$.inputField.applyStyle("width", (width - 40) + "px");
    },

    placeholderChanged: function() {
        this.$.inputField.setPlaceholder(this.placeholder);
    },

    inputChanged: function(inSender, inEvent){
        this.value = this.$.inputField.getValue();
        if(this.value){
            // if there is some text, then show the X
            this.$.image.setSrc("assets/search-input-close.png");    
            this.doInputChanged({value: this.$.inputField.getValue()});
        } else{
            this.$.image.setSrc("assets/search-input-search.png");    
            this.doInputClear();
        }
    },

    reset: function(inSender, inEvent){
        this.$.inputField.setValue("");
        this.inputChanged();
    },

    valueChanged: function(){
        this.$.inputField.setValue(this.value);
        this.inputChanged();
    }
});

/*
{kind: "onyx.InputDecorator", name: "id20", components: [
				{kind: "Input", placeholder: "Search Film", name: "filmFilter", onkeyup: "filterInputChange", onchange: "filterInputChange", onclear: "resetFilter"},
				{kind: "Image", src: "assets/search-input-search.png", name: "img20"}
			]},
*/			
