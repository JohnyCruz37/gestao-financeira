class AlertaJs {
    static showAlert(message, category) {
        const container = document.createElement('div');
        container.className = 'position-absolute position-static bottom-0 end-0';
        container.style.zIndex = '999';
        container.style.marginBottom = `${this.calculateOffset()}px`;
        const toastDiv = document.createElement('div');
        toastDiv.className = `toast align-items-center text-white bg-${category} border-5 position-relative`;
        toastDiv.setAttribute('aria-live', 'assertive');
        toastDiv.setAttribute('aria-atomic', 'true');
        const contentDiv = document.createElement('div');
        contentDiv.className = 'd-flex justify-content-between align-items-center p-3';
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'btn-close btn-close-white me-2 no-loading';
        closeButton.dataset.bsDismiss = 'toast';
        closeButton.setAttribute('aria-label', 'Close');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'toast-body';
        messageDiv.textContent = message;
        contentDiv.appendChild(closeButton);
        contentDiv.appendChild(messageDiv);
        toastDiv.appendChild(contentDiv);
        container.appendChild(toastDiv);
        document.body.appendChild(container);
        var toast = new bootstrap.Toast(toastDiv);
        toast.show();
        this.activeToasts.push(container);
        closeButton.addEventListener('click', function () {
            container.remove(container);
        });
    }
    static calculateOffset() {
        // Calcula o deslocamento com base apenas nos toasts visíveis
        let visibleToastCount = this.activeToasts.filter(toast => document.body.contains(toast)).length;
        return visibleToastCount * (50 + this.verticalOffset);
    }
    static removeToast(toastElement) {
        const index = this.activeToasts.indexOf(toastElement);
        if (index > -1) {
            this.activeToasts.splice(index, 1);
        }
        toastElement.remove();
        this.adjustAllToasts();
    }
    static adjustAllToasts() {
        let offset = 0;
        for (let toast of this.activeToasts) {
            if (document.body.contains(toast)) {
                toast.style.marginBottom = `${offset}px`;
                offset += 50 + this.verticalOffset;
            }
        }
    }
}
AlertaJs.activeToasts = [];
AlertaJs.verticalOffset = 10; // espaço vertical
export default AlertaJs;
