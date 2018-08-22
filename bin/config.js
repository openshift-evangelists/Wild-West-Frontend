var multipaas   = require('config-multipaas');

// Autodetect Linked Components
var findComponents = function(env){
  if(!env){
    env = process.env;
  }
  var component_list = []
  var name = '';
  for( var key in env ){
    name = key.replace('COMPONENT_','').replace('_HOST','')
    if(key.indexOf('COMPONENT_'+name+'_HOST') == 0 && env['COMPONENT_'+name+'_PORT']){
      component_list.push(name);
    }
  }
  return component_list;
}

var autoconfig  = function (config_overrides){
  var backend_component= undefined,
      backend_component_url= undefined,
      backend_path = process.env.BACKEND_PATH || "/ws",
      no_slash_frontend = undefined,
      frontend_path = process.env.URL_PREFIX || "/",
      components = findComponents();

  if( frontend_path.length > 1 ){
    //If we have a custom frontend path, and it's missing a trailing slash:
    if( frontend_path.substring(frontend_path.length - 1) !== "/") {
      frontend_path += "/";
    }
    no_slash_frontend = frontend_path.slice(0,frontend_path.length-1);
  }

  if(components.length < 1){
    console.error("CONFIG ERROR: Can't find backend webservices component! \nUse `odo link` to link your front-end component to a backend component.")
  }else{
    if( process.env.hasOwnProperty('BACKEND_COMPONENT_NAME') && components.includes(backend_component_name.toUpperCase())){
      backend_component = backend_component_name.toUpperCase();
    }else{
      backend_component = components[0];
    }
    backend_component_url = process.env['COMPONENT_'+backend_component+'_HOST'] + ':' + process.env['COMPONENT_'+backend_component+'_PORT']
  }
  var backend_host = process.env.BACKEND_SERVICE || backend_component_url;

  // Configure the BACKEND_SERVICE host address via environment variables,
  // OR, use `odo link backend` (where "backend" is the name of your backend component)
  // To select a specific component by name, set the "BACKEND_COMPONENT_NAME" env var:
  var config = multipaas(config_overrides).add({
    'no_slash_frontend': no_slash_frontend,
    'frontend_path': frontend_path,
    'path_info': "Frontend available at URL_PREFIX: "+frontend_path,
    'components': components,
    'backend_component_name': process.env.BACKEND_COMPONENT_NAME,
    'backend_path': backend_path,
    'backend_component': backend_component,
    'backend_component_url': backend_component_url,
    'backend_host': backend_host,
    'backend_config_error': { 'Error': "Backend Component Not Configured" },
    'backend_config_info': "Proxying \""+backend_path+"/*\" to '"+backend_host+"'"
  });

  return config;
}

exports = module.exports = autoconfig();
