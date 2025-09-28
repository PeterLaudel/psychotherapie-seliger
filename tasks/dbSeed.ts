import { FileSeedProvider, Seeder } from 'kysely-ctl'
import { db } from '../src/initialize'

export function dbSeed() {
    const seeder = new Seeder({
        db,
        provider: new FileSeedProvider({
            allowJS: true,
            seedFolder: __dirname + '/../seeds',
        })
    })

    seeder.run().then(({ error, results }) => {
        results?.forEach((it) => {
            if (it.status === 'Success') {
                console.log(`seed "${it.seedName}" was executed successfully`)
            } else if (it.status === 'Error') {
                console.error(`failed to execute migration "${it.seedName}"`)
            }
        })

        if (error) {
            console.error('failed to migrate')
            console.error(error)
            process.exit(1)
        }
    })
}


dbSeed();