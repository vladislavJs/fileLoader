function byteToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if(!bytes) {
        return '0 Byte'
    }

    const i =   parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]

}

const element = (tag, classes = [], content = '') => {
    const node = document.createElement(tag)
    node.classList.add(...classes)
    node.textContent = content

    return node
}

function noop () {

}

export function upload(select, options = {}) {
    let files = []
    const onUpload = options.onUpload() || noop
    const input = document.querySelector(select)
    const preview = element('div', ['preview'])
    const buttonOpen = element('button', ['btn'], 'Open')
    const buttonUpload = element('button', ['btn', 'primary'], 'Load')

    if(options.multiple) {
        input.setAttribute('multiple', true)
    }

    if(options.accept && Array.isArray(options.accept)) {
      input.setAttribute('accept', options.accept.join(','))
    }

    input.insertAdjacentElement('afterend', preview)
    input.insertAdjacentElement('afterend', buttonUpload)
    input.insertAdjacentElement('afterend', buttonOpen)

    const triggerInput = () => input.click()
    const changeInput = (event) => {
        files = Array.from(event.target.files)
        preview.innerHTML = ''
        files.forEach(file => {
            if(!file.type.match('image')) {
                return
            }

            const reader = new FileReader()
            reader.onload = ev => {
                preview.insertAdjacentHTML('afterbegin', `
                    <div class="preview-image">
                        <div class="preview-remove" data-name="${file.name}">&times;</div>
                        <img src="${ev.target.result}" alt="${file.name}" />
                        <div class="preview-info">
                            <span>${file.name}</span>
                            <span>${byteToSize(file.size)}</span>
                        </div>
                    </div>
                    
                `)
            }
            reader.readAsDataURL(file)
        })
    }

    const removeHandler = event => {
        if(!event.target.dataset.name) {
            return
        }

        const {name} = event.target.dataset
        files = files.filter(file => file.name !== name)
        const block = preview.querySelector(`[data-name="${name}"]`).closest('.preview-image')
        block.classList.add('removing')
        block.remove()
    }

    const clearPreview = el => {
        el.style.bottom = '4px'
        el.innerHTML = '<div class="preview-info-progress"></div>'
    }
    const uploadHandler = () => {
        preview.querySelectorAll('.preview-remove').forEach(e => e.remove())
        const previewInfo = preview.querySelectorAll('.preview-info')
        previewInfo.forEach(clearPreview)

        onUpload(files)
    }

    buttonOpen.addEventListener('click', triggerInput)
    input.addEventListener('change', changeInput)
    preview.addEventListener('click', removeHandler)
    buttonUpload.addEventListener('click', uploadHandler)
}