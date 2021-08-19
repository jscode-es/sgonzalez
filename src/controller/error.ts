class error {
    static listener() {
        process.on('unhandledRejection', error._unhandledRejection)
        process.on('uncaughtException', error._uncaughtException)
        //process.on('multipleResolves', error._multipleResolves)
    }

    static _unhandledRejection(reason: any, promise: any) {
        console.log('[ unhandledRejection ]', promise, 'reason:', reason)
    }

    static _uncaughtException(error: any) {
        console.log('[ uncaughtException ]', error)
    }
}

export default error