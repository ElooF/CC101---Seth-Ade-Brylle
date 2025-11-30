function openModal(src, description) {
            document.getElementById('myModal').style.display = 'block';
            document.getElementById('modalImage').src = src;
            document.getElementById('caption').innerHTML = description;
        }

        function closeModal() {
            document.getElementById('myModal').style.display = 'none';
        }
        
        // Close the modal if the user clicks outside of the image
        window.onclick = function(event) {
            var modal = document.getElementById('myModal');
            if (event.target == modal) {
                closeModal();
            }
        }