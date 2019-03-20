const filesystem = require('./filesystem');
const configurator = require('./configurator');
const variable = '[name]';
filesystem.setSource("./src/components");
let structureTarget = '';


module.exports = {

	promptQuestions(target) {
		structureTarget = target !== '' ? `/${target}` : '';
		configurator.startCLI(componentName => {
			this.generateComponent(componentName) 
		});
	},

	generateComponent(componentName) {
		let structure = require(`../config${structureTarget}/structure`);
		let str = JSON.stringify(structure);
		let replaceAll = (search, replacement, target) => {
		    return target.split(search).join(replacement);
		};
		str = JSON.parse(replaceAll(variable, componentName, str));
		this.mkStructure(str, () => {
			console.log("\x1b[42m", `${componentName} has been created successfully`, "\x1b[0m");
		});
	},

	mkStructure(structure, callback) {
		let structureKeys = Object.keys(structure);
		let parentPath = '';
		if(!filesystem.checkDirectoryExistance(structure.name)) {
			structureKeys.map( key => {
				if (key == 'name' && typeof structure[key] === 'string' ) {
					filesystem.makeDirectory(structure[key]);
					parentPath += structure[key];
				} else {
					this.mapStructure(parentPath, structure[key]);
				}
			});
			callback();
		} else {
			console.error("\x1b[41m", `${structure.name} already exist !`, "\x1b[0m");
		}
	},

	mapStructure(parentPath, structure) {
		structure.map( _obj => {
			if (_obj.type == 'directory') {
				filesystem.makeDirectory(parentPath+'/'+_obj.name);
				if (typeof _obj.children !== 'undefined') {
					this.mapStructure(parentPath + '/' + _obj.name, _obj.children);
				}
			} else {
				let _content = typeof _obj.content !== 'undefined' ? _obj.content : '';
				if (typeof _content == 'object') {
					_content = JSON.stringify(_content);
				}
				filesystem.makeFile(parentPath + '/' + _obj.name, _content);
			}
		});
	},
}
