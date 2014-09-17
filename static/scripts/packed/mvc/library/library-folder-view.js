define(["libs/toastr","mvc/library/library-model","mvc/ui/ui-select"],function(d,c,a){var b=Backbone.View.extend({el:"#center",model:null,options:{},events:{"click .toolbtn_save_permissions":"savePermissions"},initialize:function(e){this.options=_.extend(this.options,e);if(this.options.id){this.fetchFolder()}},fetchFolder:function(e){this.options=_.extend(this.options,e);this.model=new c.FolderAsModel({id:this.options.id});var f=this;this.model.fetch({success:function(){if(f.options.show_permissions){f.showPermissions()}else{f.render()}},error:function(h,g){if(typeof g.responseJSON!=="undefined"){d.error(g.responseJSON.err_msg+" Click this to go back.","",{onclick:function(){Galaxy.libraries.library_router.back()}})}else{d.error("An error ocurred. Click this to go back.","",{onclick:function(){Galaxy.libraries.library_router.back()}})}}})},render:function(e){$(".tooltip").remove();this.options=_.extend(this.options,e);var f=this.templateFolder();this.$el.html(f({item:this.model}));$(".peek").html(this.model.get("peek"));$("#center [data-toggle]").tooltip()},shareFolder:function(){d.info("Feature coming soon.")},goBack:function(){Galaxy.libraries.library_router.back()},showPermissions:function(f){this.options=_.extend(this.options,f);$(".tooltip").remove();var h=false;if(Galaxy.currUser){h=Galaxy.currUser.isAdmin()}var g=this.templateFolderPermissions();this.$el.html(g({folder:this.model,is_admin:h}));var e=this;if(this.options.fetched_permissions===undefined){$.get("/api/folders/"+e.id+"/permissions?scope=current").done(function(i){e.prepareSelectBoxes({fetched_permissions:i})}).fail(function(){d.error("An error occurred while attempting to fetch folder permissions.")})}else{this.prepareSelectBoxes({})}$("#center [data-toggle]").tooltip();$("#center").css("overflow","auto")},_serializeRoles:function(g){var e=[];for(var f=0;f<g.length;f++){e.push(g[f]+":"+g[f])}return e},prepareSelectBoxes:function(h){this.options=_.extend(this.options,h);var f=this.options.fetched_permissions;var g=this;var i=this._serializeRoles(f.add_library_item_role_list);var j=this._serializeRoles(f.manage_folder_role_list);var e=this._serializeRoles(f.modify_folder_role_list);g.addSelectObject=new a.View(this._createSelectOptions(this,"add_perm",i,false));g.manageSelectObject=new a.View(this._createSelectOptions(this,"manage_perm",j,false));g.modifySelectObject=new a.View(this._createSelectOptions(this,"modify_perm",e,false))},_createSelectOptions:function(e,j,h){var i={minimumInputLength:0,css:j,multiple:true,placeholder:"Click to select a role",container:e.$el.find("#"+j),ajax:{url:"/api/folders/"+e.id+"/permissions?scope=available",dataType:"json",quietMillis:100,data:function(k,l){return{q:k,page_limit:10,page:l}},results:function(m,l){var k=(l*10)<m.total;return{results:m.roles,more:k}}},formatResult:function f(k){return k.name+" type: "+k.type},formatSelection:function g(k){return k.name},initSelection:function(k,m){var l=[];$(k.val().split(",")).each(function(){var n=this.split(":");l.push({id:n[1],name:n[1]})});m(l)},initialData:h.join(","),dropdownCssClass:"bigdrop"};return i},comingSoon:function(){d.warning("Feature coming soon.")},copyToClipboard:function(){var e=Backbone.history.location.href;if(e.lastIndexOf("/permissions")!==-1){e=e.substr(0,e.lastIndexOf("/permissions"))}window.prompt("Copy to clipboard: Ctrl+C, Enter",e)},_extractIds:function(e){ids_list=[];for(var f=e.length-1;f>=0;f--){ids_list.push(e[f].id)}return ids_list},savePermissions:function(h){var g=this;var e=this._extractIds(this.addSelectObject.$el.select2("data"));var i=this._extractIds(this.manageSelectObject.$el.select2("data"));var f=this._extractIds(this.modifySelectObject.$el.select2("data"));$.post("/api/folders/"+g.id+"/permissions?action=set_permissions",{"add_ids[]":e,"manage_ids[]":i,"modify_ids[]":f,}).done(function(j){g.showPermissions({fetched_permissions:j});d.success("Permissions saved.")}).fail(function(){d.error("An error occurred while attempting to set folder permissions.")})},templateFolder:function(){var e=[];e.push('<div class="library_style_container">');e.push('  <div id="library_toolbar">');e.push('   <button data-toggle="tooltip" data-placement="top" title="Modify library item" class="btn btn-default toolbtn_modify_dataset primary-button" type="button"><span class="fa fa-pencil"></span> Modify</span></button>');e.push('   <a href="#folders/<%- item.get("folder_id") %>/datasets/<%- item.id %>/permissions"><button data-toggle="tooltip" data-placement="top" title="Manage permissions" class="btn btn-default toolbtn_change_permissions primary-button" type="button"><span class="fa fa-group"></span> Permissions</span></button></a>');e.push('   <button data-toggle="tooltip" data-placement="top" title="Share dataset" class="btn btn-default toolbtn-share-dataset primary-button" type="button"><span class="fa fa-share"></span> Share</span></button>');e.push("  </div>");e.push("  <p>");e.push("  This dataset is unrestricted so everybody can access it. Just share the URL of this page. ");e.push('  <button data-toggle="tooltip" data-placement="top" title="Copy to clipboard" class="btn btn-default btn-copy-link-to-clipboard primary-button" type="button"><span class="fa fa-clipboard"></span> To Clipboard</span></button> ');e.push("  </p>");e.push('<div class="dataset_table">');e.push('   <table class="grid table table-striped table-condensed">');e.push("       <tr>");e.push('           <th scope="row" id="id_row" data-id="<%= _.escape(item.get("ldda_id")) %>">Name</th>');e.push('           <td><%= _.escape(item.get("name")) %></td>');e.push("       </tr>");e.push('   <% if (item.get("file_ext")) { %>');e.push("       <tr>");e.push('           <th scope="row">Data type</th>');e.push('           <td><%= _.escape(item.get("file_ext")) %></td>');e.push("       </tr>");e.push("   <% } %>");e.push("    </table>");e.push("</div>");e.push("</div>");return _.template(e.join(""))},templateFolderPermissions:function(){var e=[];e.push('<div class="library_style_container">');e.push('  <div id="library_toolbar">');e.push('   <a href="#/folders/<%= folder.get("parent_id") %>"><button data-toggle="tooltip" data-placement="top" title="Go back to the parent folder" class="btn btn-default primary-button" type="button"><span class="fa fa-caret-left fa-lg"></span> Parent folder</span></button></a>');e.push("  </div>");e.push('<h1>Folder: <%= _.escape(folder.get("name")) %></h1>');e.push('<div class="alert alert-warning">');e.push("<% if (is_admin) { %>");e.push("You are logged in as an <strong>administrator</strong> therefore you can manage any folder on this Galaxy instance. Please make sure you understand the consequences.");e.push("<% } else { %>");e.push("You can assign any number of roles to any of the following permission types. However please read carefully the implications of such actions.");e.push("<% }%>");e.push("</div>");e.push('<div class="dataset_table">');e.push("<h2>Folder permissions</h2>");e.push("<h4>Roles that can manage permissions on this folder</h4>");e.push('<div id="manage_perm" class="manage_perm roles-selection"></div>');e.push('<div class="alert alert-info roles-selection">User with <strong>any</strong> of these roles can manage permissions on this folder.</div>');e.push("<h4>Roles that can add items to this folder</h4>");e.push('<div id="add_perm" class="add_perm roles-selection"></div>');e.push('<div class="alert alert-info roles-selection">User with <strong>any</strong> of these roles can add items to this folder (folders and datasets).</div>');e.push("<h4>Roles that can modify this folder</h4>");e.push('<div id="modify_perm" class="modify_perm roles-selection"></div>');e.push('<div class="alert alert-info roles-selection">User with <strong>any</strong> of these roles can modify this folder (name, etc.).</div>');e.push('<button data-toggle="tooltip" data-placement="top" title="Save modifications" class="btn btn-default toolbtn_save_permissions primary-button" type="button"><span class="fa fa-floppy-o"></span> Save</span></button>');e.push("</div>");e.push("</div>");return _.template(e.join(""))}});return{FolderView:b}});