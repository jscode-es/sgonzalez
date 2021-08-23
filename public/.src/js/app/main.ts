import "./components/block"

declare global {
    interface Window {
        closeContentDynamic: any;
    }
}

declare var hljs: any

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const addClass = (element: any, className = '') => element.classList.add(className)
const removeClass = (element: any, className = '') => element.classList.remove(className)
const getValueByName = (name: string) => (<HTMLInputElement>$(`[name="${name}"]`)).value.trim()
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

let content_dynamic = $('.load_dynamic')

const APP = async () => {

    let small = $('.text_small')
    let text = $$('.text_main')

    let open_content = $$('.open_content')

    open_content.forEach(item => {

        item.addEventListener('click', async function (event) {

            event.preventDefault()

            let element: any = event.currentTarget.dataset.page

            let options: any =
            {
                method: 'GET',
                headers:
                {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                cache: 'default'

            }

            let data = await (await fetch(`/${element}`, options)).text()

            content_dynamic.innerHTML = data

            hljs.highlightAll()

            let form = $('form')

            if (form) {

                let info = $('.info-form')

                form.addEventListener('submit', async function (event) {

                    event.preventDefault()

                    let name = getValueByName('name')
                    let subject = getValueByName('subject')
                    let msn = getValueByName('msn')

                    removeClass(info, 'error')

                    if (name.length != 0 &&
                        subject.length != 0 &&
                        msn.length != 0) {

                        options.method = 'post'
                        options.body = JSON.stringify({ name, subject, msn })

                        let data = await (await fetch('/contact', options)).json()

                        let status = 'error'

                        if (data) {
                            status = 'success'
                            event.target.reset()
                        }

                        addClass(info, status)

                        setTimeout(() => { removeClass(info, status) }, 3000)

                    } else {

                        addClass(info, 'error')
                    }

                })
            }

            addClass(content_dynamic, 'animate')

        })
    })


    // ANIMACION DE LA LETRAS
    addClass(small, 'animate')

    for (const item of text) {

        await delay(800)
        addClass(item, 'animate')
    }

}

window.closeContentDynamic = () => {

    removeClass(content_dynamic, 'animate')
}

window.onload = APP