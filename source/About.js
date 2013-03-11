enyo.kind({
	name: "aboutView",
	kind: "FittableRows",
	classes: "enyo-fit dark-scene aboutView",
	fit: true,
	events: {
		onOK: "",
	},
	components: [
		{kind: "onyx.Toolbar", name: "aboutHeader",  layoutKind: "FittableColumnsLayout", style: "height: 50px;", components: [
			{kind: "Control", content: "About", name: "c50", fit: true},
			{name: "okButton", kind: "onyx.IconButton", src: "assets/invite-icon-accept.png", ontap: "doOK", style: "width: 32x; float: right;"}
		]},
		{kind: "Scroller", name: "scroller",  classes: "enyo-scroller", thumb: false, fit: true, touch: true, horizontal: "hidden", components: [
			{name: "thanks",  style: "font-size: 14px; font-weight: normal; margin: 10px", content: "Thank you for using MyLocalVue App."},
			{kind: "onyx.Groupbox", classes: "inputGroup", components: [
				{kind: "onyx.GroupboxHeader", content: "Coming Soon"},
				{classes: "helpText", content: "Upcoming Films"}
			]},
			{tag: "br"},
			{kind: "onyx.Groupbox", classes: "inputGroup", components: [
				{kind: "onyx.GroupboxHeader", content: "Feedback"},
				{classes: "helpText", content: "We would love to hear about what you think about this app. If you find the app useful, please consider writing a review to let others know."}
			]},
			{tag: "br"},
			{kind: "onyx.Groupbox", classes: "inputGroup", components: [
				{kind: "onyx.GroupboxHeader", content: "Notice"},
				{classes: "helpText", content: "This is an unofficial App not affiliated with Vue Cinemas Ltd. The film information is retrieved from the Vue Cinema Website. The film booking service is provided by MyVue Mobile website, Please read the terms and conditions of the MyVue website before proceeding with your booking."}
			]},
			{tag: "br"},
			{kind: "onyx.Groupbox", classes: "inputGroup", components: [
				{kind: "onyx.GroupboxHeader", content: "About"},
				{ kind: "onyx.InputDecorator", align: "center", ontap: "doEmail", components:[
					{ kind: "onyx.IconButton", src: "assets/application-email.png", style: "margin-right: 10px;",  align: "left"},
					{ content: "feedback@mobileteck.com"}
				]},
				{ kind: "onyx.InputDecorator", align: "center", ontap: "doWebsite", components:[
					{ kind: "onyx.IconButton", src: "assets/browser-32x32.png", style: "margin-right: 10px;",  align: "left"},
					{ content: "Mobileteck.com"}
				]},
				{ kind: "onyx.InputDecorator", align: "center", ontap: "doOtherApps", components:[
					{ kind: "onyx.IconButton", src: "assets/appcatalog-32x32.png", style: "margin-right: 10px;",  align: "left"},
					{ content: "Checkout our other Apps"}
				]}
			]},
			{name: "version", allowHtml: true, style: "font-size: 14px; font-weight: normal; margin: 5px"},
			{name: "copyright", allowHtml: true, style: "font-size: 14px; font-weight: normal; margin: 5px"}
		]},
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", name: "mt50", noStretch: true, components: [
				{content: "", style: "height: 32px;"},
				{kind: "onyx.Grabber", name: "gr20"}
		]}
	],

 	create: function(){
        this.inherited(arguments);
        this.$.version.setContent("MyLocalVue v2.0.0");
		this.$.copyright.setContent("&copy; Copyright " + new Date().getFullYear() + " Mobileteck.com");
    },

    doWebsite: function() {
   		window.open('http://www.mobileteck.com','external');	
    },

    doOtherApps: function() {
   		window.open('http://www.mobileteck.com','external');	
    },

    doEmail: function() {
   		 window.location.replace('mailto:feedback@mobileteck.com?subject=MyLocalVue Feedback');	
    }

 	
});