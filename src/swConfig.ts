const REGISTRATION = {
  onUpdate: (registration : ServiceWorkerRegistration) => {
    registration.unregister().then(() => {
    window.location.reload()
  })
 },
 onSuccess: (registration : ServiceWorkerRegistration) => {
   console.info('service worker on success state')
   console.log(registration)
  },
 };

 export default REGISTRATION;