import { NodeMediator } from '../dist'
import relations from './relations'
import Tester from './Tester'
import Logger from './Logger'
import Uploader from './Uploader'

class Main {
  async run() {
    // our mediator is a singleton, first time we call .getInstance with our relations map to initialize the mediator
    const mediator = NodeMediator.getInstance(relations)
    /*
      subsequent calls to getInstance will ignore any params and return our mediator singleton
      NodeMediator.getInstance() -> mediator
    */

    // we call our extended Colleagues with their name and we pass the mediator singleton to them
    const tester = new Tester('tester', mediator)
    const logger = new Logger('logger', mediator)
    const uploader = new Uploader('uploader', mediator)

    // register the extended Colleagues.
    tester.register()
    logger.register()
    uploader.register()

    // define events. Only events defined in relationsMap will be allowed!
    logger.on('log', logger.log)
    tester.on('test', tester.test)
    uploader.on('upload', uploader.upload)

    // example emit
    tester.emit('test')
    /*
      we can also call .emitAsync. If you have a lot of async operations 
      but you still want them decoupled, you can use .emitAsync, 
      .emitAsync uses promise.all to resolve all listeners promises and return all values.
     */

    // we defined our tester and uplaoder to allow firing upload
    const uploaded = await uploader.emitAsync('upload', 'some data for upload...')
    console.log(uploaded)
  }
}
new Main().run()
