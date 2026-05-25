import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

        const supabaseUrl = 'https://huckskoxbhfpvmxjiwft.supabase.co';
        const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1Y2tza294YmhmcHZteGppd2Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1Mjg0NTEsImV4cCI6MjA5NTEwNDQ1MX0.74oV1DvXTMciuPvhp4ZhMuKxRKzIP72vvM17B9Dg6lc';
        const supabase = createClient(supabaseUrl, supabaseKey);

        const rsvpForm = document.getElementById('rsvpForm');
        const guestList = document.getElementById('guestList');
        
        window.showCustomModal = (title, message, type = 'success') => {
            const modal = document.getElementById('customModal');
            const icon = document.getElementById('modalIcon');
            document.getElementById('modalTitle').innerText = title;
            document.getElementById('modalMessage').innerText = message;
            
            if (type === 'error') {
                icon.className = 'ph ph-x-circle modal-icon';
                icon.style.color = '#c62828';
            } else if (type === 'info') {
                icon.className = 'ph ph-info modal-icon';
                icon.style.color = 'var(--primary)';
            } else {
                icon.className = 'ph ph-check-circle modal-icon';
                icon.style.color = 'var(--gold)';
            }
            
            modal.classList.add('show');
        };

        window.closeCustomModal = () => document.getElementById('customModal').classList.remove('show');

        function escapeHTML(str) {
            if (!str) return '';
            return str.replace(/[&<>"']/g, function(match) {
                const map = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#x27;'
                };
                return map[match];
            });
        }

        async function loadGuest() {
            const { data, error } = await supabase
                .from('daftar_hadir')
                .select('*')
                .order('id', { ascending: false });

            if (error) {
                guestList.innerHTML = '<p style="text-align:center;">Gagal memuat data ucapan.</p>';
                return;
            }

            guestList.innerHTML = '';
            let hadir = 0; let tidakHadir = 0;

            if(data.length === 0) {
                guestList.innerHTML = '<p style="text-align:center; color:var(--text-muted);">Belum ada ucapan. Jadilah yang pertama!</p>';
            }

            data.forEach(item => {
                if (item.kehadiran === 'Hadir') hadir++; else tidakHadir++;
                const badgeClass = item.kehadiran === 'Hadir' ? 'hadir' : 'tidak';
                
                guestList.innerHTML += `
                    <div class="guest-card">
                        <div class="guest-card-header">
                            <h4><i class="ph ph-user"></i> ${escapeHTML(item.nama)}</h4>
                            <span class="badge ${badgeClass}">${escapeHTML(item.kehadiran)}</span>
                        </div>
                        <p style="font-size: 14px; color: var(--text-muted);"><i class="ph ph-quotes"></i> ${escapeHTML(item.ucapan || '')}</p>
                    </div>
                `;
            });

            document.getElementById('hadirCount').innerText = hadir;
            document.getElementById('tidakHadirCount').innerText = tidakHadir;
        }

        rsvpForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            let nama = document.getElementById('guestInput').value.replace(/\s+/g, ' ').trim();
            let kehadiran = document.getElementById('attendanceInput').value.trim();
            let ucapan = document.getElementById('messageInput').value.replace(/\s+/g, ' ').trim();

            if (nama.length < 2 || nama.length > 50) {
                window.showCustomModal('Perhatian', 'Nama harus diisi dengan benar (2-50 karakter).', 'error');
                return;
            }
            if (!kehadiran) {
                window.showCustomModal('Perhatian', 'Mohon pilih konfirmasi kehadiran.', 'error');
                return;
            }
            if (ucapan.length < 5 || ucapan.length > 300) {
                window.showCustomModal('Perhatian', 'Ucapan harus diisi dengan benar (5-300 karakter).', 'error');
                return;
            }

            const submitBtn = rsvpForm.querySelector('button');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="ph ph-spinner music-spin"></i> Mengirim...';
            submitBtn.disabled = true;

            const { error } = await supabase.from('daftar_hadir').insert([{ nama, kehadiran, ucapan }]);

            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;

            if (error) {
                window.showCustomModal('Maaf', 'Gagal mengirim RSVP. Coba lagi nanti.', 'error');
            } else {
                window.showCustomModal('Terima Kasih', 'Ucapan & konfirmasi kehadiran Anda berhasil dikirim ❤️', 'success');
                rsvpForm.reset();
                loadGuest();
            }
        });
        loadGuest();

        document.addEventListener('DOMContentLoaded', () => {
            
            const particleContainer = document.getElementById('particles-container');
            const petalCount = 18; 
            
            for (let i = 0; i < petalCount; i++) {
                let petal = document.createElement('div');
                petal.classList.add('petal');
                let size = Math.random() * 8 + 8; 
                petal.style.width = `${size}px`;
                petal.style.height = `${size}px`;
                petal.style.left = `${Math.random() * 100}vw`;
                petal.style.animationDuration = `${Math.random() * 5 + 7}s`; 
                petal.style.animationDelay = `${Math.random() * 10}s`;
                particleContainer.appendChild(petal);
            }

            document.body.style.overflow = 'hidden';
            
            const openingScreen = document.getElementById('openingScreen');
            const openBtn = document.getElementById('openInvitation');
            const music = document.getElementById('backgroundMusic');
            const musicToggle = document.getElementById('musicToggle');
            const themeToggle = document.getElementById('themeToggle');
            
            let isMusicPlaying = false;
            const urlParams = new URLSearchParams(window.location.search);
            const guestName = urlParams.get('to') ? decodeURIComponent(urlParams.get('to')) : "Tamu Undangan";
            
            const typeWriterElem = document.getElementById('guestNameTypewriter');
            let i = 0;
            const typeWriter = () => {
                if (i < guestName.length) {
                    typeWriterElem.innerHTML += guestName.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            setTimeout(typeWriter, 800);

            openBtn.addEventListener('click', () => {
                openingScreen.classList.add('opened');
                document.body.style.overflow = 'auto';
                
                music.play().then(() => {
                    isMusicPlaying = true;
                    musicToggle.classList.remove('music-paused');
                }).catch(e => console.log("Auto-play terhalang browser", e));
            });

            musicToggle.addEventListener('click', () => {
                if(isMusicPlaying) {
                    music.pause();
                    musicToggle.classList.add('music-paused');
                    musicToggle.innerHTML = '<i class="ph ph-music-notes-simple"></i>';
                } else {
                    music.play();
                    musicToggle.classList.remove('music-paused');
                    musicToggle.innerHTML = '<i class="ph ph-music-notes"></i>';
                }
                isMusicPlaying = !isMusicPlaying;
            });

            const currentTheme = localStorage.getItem('wedding_theme') || 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);
            updateThemeIcon(currentTheme);

            themeToggle.addEventListener('click', () => {
                const theme = document.documentElement.getAttribute('data-theme');
                const newTheme = theme === 'light' ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('wedding_theme', newTheme);
                updateThemeIcon(newTheme);
            });

            function updateThemeIcon(theme) {
                themeToggle.innerHTML = theme === 'dark' ? '<i class="ph ph-sun"></i>' : '<i class="ph ph-moon"></i>';
            }

            const targetDate = new Date("June 23, 2026 08:00:00").getTime();
            const updateCountdown = () => {
                const distance = targetDate - new Date().getTime();
                if(distance < 0) return;

                const formatNum = num => num < 10 ? `0${num}` : num;
                document.getElementById('days').innerText = formatNum(Math.floor(distance / (1000 * 60 * 60 * 24)));
                document.getElementById('hours').innerText = formatNum(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
                document.getElementById('minutes').innerText = formatNum(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
                document.getElementById('seconds').innerText = formatNum(Math.floor((distance % (1000 * 60)) / 1000));
            };
            setInterval(updateCountdown, 1000);
            updateCountdown();

            const reveals = document.querySelectorAll('.reveal');
            const revealObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if(!entry.isIntersecting) return;
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                });
            }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

            reveals.forEach(reveal => revealObserver.observe(reveal));

            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.bottom-nav a');
            
            window.addEventListener('scroll', () => {
                let current = '';
                sections.forEach(section => {
                    if(pageYOffset >= (section.offsetTop - section.clientHeight / 3)) {
                        current = section.getAttribute('id');
                    }
                });

                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if(link.getAttribute('href').includes(current)) link.classList.add('active');
                });
            });
            
            window.copyText = async (text) => {
                try {
                    await navigator.clipboard.writeText(text);
                    window.showCustomModal('Berhasil disalin', `Nomor rekening ${text} berhasil disalin!`, 'success');
                } catch (err) {
                    const input = document.createElement('input');
                    input.setAttribute('value', text);
                    document.body.appendChild(input);
                    input.select();
                    document.execCommand('copy');
                    document.body.removeChild(input);
                    window.showCustomModal('Berhasil disalin', `Nomor rekening ${text} berhasil disalin!`, 'success');
                }
            };
            
            window.openImgModal = src => {
                document.getElementById('imgPreview').src = src;
                document.getElementById('imgModal').classList.add('show');
            };
            
            window.closeImgModal = () => document.getElementById('imgModal').classList.remove('show');
        });