// Copyright 2013, $ORGANIZATION
// All rights reserved.
enyo.kind({
	name: "CinemaReader",
	kind: "FittableRows",
	fit: true,
	classes: "enyo-fit dark-scene",
	style: "min-width: 300px;",
	published: {
	},
	events: {
		onShowAbout: "",
		onSelectCinema: "",
		onShowSpinner: "",
		onCheckInternetConnection: ""
	},
	components: [
		{kind: "onyx.Toolbar", name: "cinemaHeader",  layoutKind: "FittableColumnsLayout", style: "height: 50px;", components: [
			{kind: "Control", content: "Cinemas", name: "c10", fit: true},
			{name: "refineButton", kind: "onyx.IconButton", src: "assets/more-menu-icon.png", ontap: "doShowAbout", style: "width: 32x; float: right;"}
		]},
		{
			kind: "SearchInput",
			placeholder: "Search Cinmea", 
			name: "cinemaFilter", 
			onInputChanged: "filterInputChange",
			onInputClear: "resetFilter"
		},
		{kind: "PulldownList", fixedHeight: false, count: 10, rowsPerPage: 10, strategyKind: "TouchScrollStrategy", classes: "enyo-list", content: "pulldownList", fit: true, controlParentName: "client", name: "list", components: [
				{kind: "onyx.InputDecorator", classes: "item enyo-border-box", style: "width: 100%;", name: "cinemaRow", components: [
					{kind: "Control", fit: true,  name: "cinema", ontap: "selectCinema", style: "padding-top: 10px; padding-bottom: 10px; width: 200px;"},
					{kind: "onyx.IconButton", src: "assets/menu-icon-favorites.png", style: "height: 32px; float: right;", name: "itemFavorite", ontap: "favoriteStarClickHandler"},
				]}
			], onPullRelease: "pullRelease", onPullComplete: "pullComplete", onSetupItem: "getItem"},
		{kind: "onyx.Toolbar", layoutKind: "FittableColumnsLayout", name: "mt10", noStretch: true, components: [
			{kind: "Control", content: "Favourites Only", fit: true, name: "c12"},
			{kind: "onyx.ToggleButton", name: "favouriteToggle", onChange: "toggleChanged"}
		]},
		{name: "reloadDialog", kind: "onyx.Popup", modal: true, centered: true, classes: "popup", autoDismiss: false, components: [
			{ classes: "reloadDialogDescription", content: "Reloading will rest your Favourite Cinemas, Are you sure you want to continue?"},
			{ kind : "onyx.Button", content: "Cancel", ontap: "closeReloadDialog", classes: "onyx-affirmative reloadDialogBtn"},
			{ kind : "onyx.Button", content: "Reload", ontap: "reloadCinemaList", classes: "onyx-negative reloadDialogBtn"}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.cinemaList = [];
		this.cinemaFilteredList = [];
		this.selectedCinema = -1; 
		this.prefs = {};

		// Don't do anything heavy in the creation method, you will end up 
		// seeing a blank screen or a screenshot of the previous app you were running
		// So kick of an async job to load the data
		enyo.job("load", enyo.bind(this, "loadData"), 1000);
		
	},

	rendered: function() {
    	this.inherited(arguments);
		this.$.cinemaFilter.resize(this.hasNode().offsetWidth);
	},

	loadData: function() {
		this.log("Loading Data");
		this.loadPreferences();
		
		if(this.cinemaList.length === 0){
			this.$.list.pullRelease();
		} else{
			this.initializeCinemaList();
		}
	},

	loadPreferences: function(){
		var prefsString = localStorage.getItem("prefs");
		if (prefsString) {
     		this.prefs = JSON.parse(prefsString);	
     	}  else {
     		this.prefs = {"favouriteOnly": false};
     	}  

     	var cinemaString = localStorage.getItem("cinemaList");
     	if (cinemaString) {
     		this.cinemaList = JSON.parse(cinemaString);	
     	} else{
     		this.cinemaList = [];
     	}

     	if(this.prefs.favouriteOnly){
     		this.$.favouriteToggle.setActive(this.prefs.favouriteOnly);	
     	}
   		
     			
	},

	savePreferences: function(){
		this.log("Saving Preferences");
		if(this.prefs){
			this.prefs.favouriteOnly = this.$.favouriteToggle.getActive();
			localStorage.setItem("prefs", JSON.stringify(this.prefs));	
		}
	},

	loadCinemaList: function(){
		this.doShowSpinner({show: true});
		var url = serviceURL + "/default.aspx";
		this.log("Loading Cinema List from " + url);
		if(this.doCheckInternetConnection()){
			new enyo.Ajax({url: url, handleAs: "text"}).go().response(this, "gotResults").error(this, "gotFailure");	
		} else{
			this.doShowSpinner({show: false});
		}	
	},
	
	parseCinemaData: function(xml){
    
		//this.log(xml);

        var x = xml.querySelectorAll("select#content1_ctl00_lbCinemas");
        //this.log("x=" + x.length);
        var cinemas = [];
        if (x.length > 0) {
            var r = x[0].querySelectorAll("option");
            //this.log("r=" + r.length);
            var j = 0;
            for (j = 0; j < r.length; j++) {
            
                var cinema = this.cleanString(r[j].innerText);
                var id = r[j].getAttribute("value");
                var fav = false;
                if (id > 0) {
                    cinemas.push({
                        c: cinema,
                        id: id,
                        f: fav
                    });
                }
                
                //this.log(id + ' : ' + cinema);
            }
        }
        
        return cinemas;
    },
    
    cleanString: function(a){
        return a.replace(/\t/g, "").replace(/^\s+|\s+$/g, '');
    },
	
	gotResults: function(inSender, inResponse) {
		this.doShowSpinner({show: false});
		//this.log("gotResults");
		var myDiv = window.document.createElement("div");
		myDiv.innerHTML = inResponse;
		this.cinemaList = this.parseCinemaData(myDiv);
		if(this.cinemaList){
			localStorage.setItem("cinemaList", JSON.stringify(this.cinemaList));
			this.initializeCinemaList();

		} else {
			this.log("Error Loading Cinema List");
			//this.doError({title: 'Service Error', message: 'Looks like we are having some trouble loading data. Please try again shortly.'});
		}
    },

    initializeCinemaList: function() {
    	this.$.list.setCount(this.cinemaList.length);
    	this.$.list.completePull();	
    	
    	this.cinemaFilteredList = this.cinemaList;
		this.$.cinemaFilter.setValue("");
		this.selectedCinema = -1;

		if(this.cinemaFilteredList.length>0) {
			// Nothing Selected, defaults to first one
			this.selectedCinema = 0;
			var cinema = this.cinemaFilteredList[0];
			if(cinema) {
				this.doSelectCinema({"cinema": cinema, "clicked": false});	
			}	

			
		}
		this.$.list.reset();
		this.toggleChanged();
		this.reflow();
    },

	gotFailure: function(inSender, inResponse) {
		this.doShowSpinner({show: false});
		this.log("gotFailure");
		this.log(inResponse);
		//this.doError({title: 'Service Error', message: 'Looks like we are having some trouble loading data. Please try again shortly.'});

	},

    pullRelease: function(inSender, inEvent) {
		if(this.cinemaList.length > 0) {
			this.$.reloadDialog.show();	
		} else{
			this.loadCinemaList();
		}
    },

    closeReloadDialog: function() {
		this.$.reloadDialog.hide();
		this.$.list.completePull();	
	},

    reloadCinemaList: function(){
    	this.$.reloadDialog.hide();
    	this.loadCinemaList();
    },

    pullComplete: function(inSender, inEvent) {
        // TODO - Auto-generated code
    },
    getItem: function(inSender, inEvent) {
        var index = inEvent.index;
        var r = this.cinemaFilteredList[index];

        if(r) {
			this.$.cinema.setContent(r.c);	
			if(r.f){
			//this.log("Active=" + index);
				this.$.itemFavorite.addClass("active");
			} else{
				this.$.itemFavorite.removeClass("active");
			}

			if(index === this.selectedCinema) {
			 	this.$.cinemaRow.addClass("active-row");	
			}else{
				this.$.cinemaRow.addRemoveClass("active-row");
			}

			return true;				
        }	
        
        return false;
    },
    
    selectCinema: function(inSender, inEvent) {
        var cinema = this.cinemaFilteredList[inEvent.rowIndex];
        if(cinema){
        	this.selectedCinema = inEvent.rowIndex;
        	this.log('Selected Cinema: ' + cinema.c);
			this.doSelectCinema({"cinema": cinema, "clicked": true});	
			this.$.list.refresh();
        }
    },
    
    toggleChanged: function(inSender, inEvent) {
		this.filterChange();
		this.savePreferences();
	},
	
    favoriteStarClickHandler: function(inSender, inEvent) {
        var index = inEvent.index;
        
		if(this.cinemaFilteredList){
		var r = this.cinemaFilteredList[index];
        if(r) {
			r.f = !r.f;
			localStorage.setItem("cinemaList", JSON.stringify(this.cinemaList));
			this.$.list.reset();		
        }
        
        }   
    },
    
    filterInputChange: function(inSender, inEvent) {
        enyo.job("filterChange", enyo.bind(this, "filterChange"), 400);
    },
    
    filterChange: function() {
		var filterString = this.$.cinemaFilter.getValue();
		var favouriteOnly = this.$.favouriteToggle.getActive();
		if(filterString || favouriteOnly) {
			var subset = [];
			var listItems = this.cinemaList;
			if(filterString) {
				filterString = filterString.toLowerCase();	
			}
			var i = 0;
			while(i < listItems.length) {
				if(!favouriteOnly || favouriteOnly && listItems[i].f){
					if(filterString){
						if(listItems[i].c.toLowerCase().indexOf(filterString) >= 0) {
							subset.push(listItems[i]);
						}		
					} else{
						subset.push(listItems[i]);
					}
					
				}
				
				i++;
			}
			this.cinemaFilteredList = subset;
			this.$.list.setCount(this.cinemaFilteredList.length);
			this.$.list.reset();
		} else{
			this.resetFilter();
		}
		
	},

	resetFilter: function(inSender, inEvent) {
		if(this.$.cinemaFilter.getValue()){
			this.$.cinemaFilter.setValue("");	
		}
		this.cinemaFilteredList = this.cinemaList;
		this.$.list.setCount(this.cinemaFilteredList.length);
        this.$.list.reset();
    }

});
