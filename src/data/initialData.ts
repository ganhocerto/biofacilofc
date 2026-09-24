import { Niche, BiositeTemplate } from '../types';

export const INITIAL_NICHES: (Omit<Niche, 'createdAt' | 'updatedAt'> & { slug: string })[] = [
  {
    id: 'barbearia',
    name: 'Barbearia',
    slug: 'barbearia',
    description: '',
    icon: 'Scissors',
    order: 1,
    active: true,
    modelCount: 1,
  },
  {
    id: 'beleza-estetica',
    name: 'Beleza & Estética',
    slug: 'beleza-estetica',
    description: '',
    icon: 'Sparkles',
    order: 2,
    active: true,
    modelCount: 1,
  },
  {
    id: 'gastronomia-delivery',
    name: 'Gastronomia & Delivery',
    slug: 'gastronomia-delivery',
    description: '',
    icon: 'Utensils',
    order: 3,
    active: true,
    modelCount: 1,
  },
  {
    id: 'loja-comercio',
    name: 'Loja & Comércio',
    slug: 'loja-comercio',
    description: '',
    icon: 'ShoppingBag',
    order: 4,
    active: true,
    modelCount: 0,
  },
  {
    id: 'formacao-academica',
    name: 'Formação Acadêmica',
    slug: 'formacao-academica',
    description: '',
    icon: 'GraduationCap',
    order: 5,
    active: true,
    modelCount: 0,
  },
  {
    id: 'servicos-profissionais',
    name: 'Serviços Profissionais',
    slug: 'servicos-profissionais',
    description: '',
    icon: 'Briefcase',
    order: 6,
    active: true,
    modelCount: 0,
  },
  {
    id: 'modelos-premium',
    name: 'Modelos Premium',
    slug: 'modelos-premium',
    description: '',
    icon: 'Crown',
    order: 7,
    active: true,
    modelCount: 0,
  },
  {
    id: 'modelos-chatbot',
    name: 'Modelos Chatbot',
    slug: 'modelos-chatbot',
    description: '',
    icon: 'Bot',
    order: 8,
    active: true,
    modelCount: 0,
  },
  {
    id: 'saude-bem-estar',
    name: 'Saúde & Bem-Estar',
    slug: 'saude-bem-estar',
    description: '',
    icon: 'HeartPulse',
    order: 9,
    active: true,
    modelCount: 0,
  },
  {
    id: 'portfolio-criadores',
    name: 'Portfólio & Criadores',
    slug: 'portfolio-criadores',
    description: '',
    icon: 'Palette',
    order: 10,
    active: true,
    modelCount: 0,
  },
];

// Template 1: Barbearia Luxo Titanium - Black Crown Barber Club
const TEMPLATE_BARBEARIA_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Black Crown Barber Club</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #08080c; color: #e5e5e5; min-height: 100vh; display: flex; justify-content: center; padding: 24px 12px; }
    .container { max-width: 440px; width: 100%; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 24px; position: relative; }
    .logo-wrapper { width: 100px; height: 100px; margin: 0 auto 16px; position: relative; border-radius: 24px; padding: 3px; background: linear-gradient(135deg, #d97706, #9333ea, #d97706); box-shadow: 0 8px 30px rgba(217, 119, 6, 0.35); }
    .logo-img { width: 100%; height: 100%; object-fit: contain; border-radius: 20px; background: #121118; padding: 8px; border: 2px solid #222030; }
    .company-name { font-size: 24px; font-weight: 900; color: #fff; letter-spacing: -0.5px; margin-bottom: 6px; text-transform: uppercase; }
    .headline { font-size: 15px; font-weight: 700; color: #fbbf24; letter-spacing: 0.5px; margin-bottom: 6px; }
    .subtitulo { font-size: 13px; color: #9ca3af; line-height: 1.5; padding: 0 8px; }
    
    .social-bar { display: flex; justify-content: center; gap: 12px; margin: 20px 0; }
    .social-btn { width: 44px; height: 44px; border-radius: 12px; background: #14131d; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: #fff; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
    .social-btn:hover { border-color: #f59e0b; transform: translateY(-2px); }
    
    .cta-main { display: flex; align-items: center; justify-content: center; gap: 10px; background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff; text-decoration: none; padding: 16px 20px; border-radius: 16px; font-weight: 700; font-size: 15px; margin-bottom: 20px; box-shadow: 0 8px 25px -4px rgba(34, 197, 94, 0.45); text-align: center; }
    
    .section-header { font-size: 13px; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 1.5px; margin: 22px 0 12px; display: flex; align-items: center; justify-content: space-between; }
    .section-header span { background: rgba(251,191,36,0.1); padding: 3px 8px; border-radius: 6px; font-size: 11px; }

    .specialties-grid { display: flex; flex-direction: column; gap: 10px; }
    .specialty-card { display: flex; gap: 12px; background: #12111a; border: 1px solid #222030; border-radius: 16px; padding: 12px; transition: all 0.2s; }
    .specialty-card:hover { border-color: #f59e0b; }
    .specialty-img { width: 68px; height: 68px; border-radius: 12px; object-fit: cover; shrink-0; }
    .specialty-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .specialty-top { display: flex; justify-content: space-between; align-items: baseline; }
    .specialty-name { font-weight: 700; color: #fff; font-size: 15px; }
    .specialty-price { font-weight: 800; color: #fbbf24; font-size: 14px; }
    .specialty-desc { font-size: 12px; color: #888698; margin-top: 3px; line-height: 1.3; }

    .gallery-container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 20px; }
    .gallery-img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); transition: transform 0.2s; }
    .gallery-img:hover { transform: scale(1.03); }

    .info-card { background: #12111a; border: 1px solid #222030; border-radius: 16px; padding: 16px; margin-bottom: 14px; font-size: 13px; color: #d1d5db; line-height: 1.6; }
    .info-card b { color: #fff; }
    
    .google-btn { display: flex; align-items: center; justify-content: center; gap: 10px; background: #181724; border: 1px solid rgba(255,255,255,0.15); border-radius: 14px; padding: 12px; text-decoration: none; color: #fff; font-weight: 600; font-size: 13px; margin-bottom: 20px; transition: all 0.2s; }
    .google-btn:hover { background: #222032; border-color: #4285f4; }
    .google-stars { color: #fbbc05; font-size: 15px; }

    .footer { text-align: center; padding: 20px 0; font-size: 11px; color: #525062; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-wrapper">
        <img class="logo-img" data-bio-image="logo" src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&auto=format&fit=crop&q=80" alt="Black Crown Barber Club">
      </div>
      <h1 class="company-name" data-bio-text="nome_empresa">BLACK CROWN BARBER CLUB</h1>
      <div class="headline" data-bio-text="headline">SEU ESTILO COMEÇA AQUI.</div>
      <p class="subtitulo" data-bio-text="subtitulo">Precisão, personalidade e cuidado em cada detalhe.</p>
    </div>

    <div class="social-bar">
      <a href="https://instagram.com/blackcrownbarber" target="_blank" class="social-btn" data-bio-link="instagram" title="Instagram">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
      </a>
      <a href="https://maps.app.goo.gl/barber" target="_blank" class="social-btn" data-bio-link="maps" title="Localização">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
      </a>
      <a href="tel:+5531999999999" class="social-btn" data-bio-link="telefone" title="Ligar">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
      </a>
    </div>

    <a href="https://wa.me/5531999999999?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20BLACK%20CROWN%20BARBER%20CLUB%20e%20gostaria%20de%20agendar%20meu%20hor%C3%A1rio." target="_blank" class="cta-main" data-bio-link="whatsapp">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.54 1.83.822 2.796.822 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.768-5.768-5.768zm7.42 5.766c-.001 4.093-3.328 7.42-7.42 7.42-.001 0-.001 0 0 0-1.282 0-2.457-.333-3.528-.941l-4.148 1.088 1.107-4.043c-.694-1.121-1.066-2.42-1.066-3.754 0-4.092 3.327-7.419 7.42-7.419 4.092 0 7.419 3.327 7.419 7.42 0 0 0 0 0 0z"/></svg>
      <span>AGENDAR HORÁRIO NO WHATSAPP</span>
    </a>

    <!-- Especialidades (6 Itens) -->
    <div class="section-header">
      <b>Especialidades</b>
      <span>6 serviços</span>
    </div>
    <div class="specialties-grid">
      <div class="specialty-card">
        <img class="specialty-img" data-bio-image="esp_1_foto" src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&auto=format&fit=crop&q=80" alt="Corte">
        <div class="specialty-info">
          <div class="specialty-top">
            <span class="specialty-name" data-bio-text="esp_1_nome">Corte</span>
            <span class="specialty-price" data-bio-text="esp_1_preco">R$ 55</span>
          </div>
          <p class="specialty-desc" data-bio-text="esp_1_desc">Clássico ou moderno, executado com precisão.</p>
        </div>
      </div>

      <div class="specialty-card">
        <img class="specialty-img" data-bio-image="esp_2_foto" src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&auto=format&fit=crop&q=80" alt="Barba">
        <div class="specialty-info">
          <div class="specialty-top">
            <span class="specialty-name" data-bio-text="esp_2_nome">Barba</span>
            <span class="specialty-price" data-bio-text="esp_2_preco">R$ 45</span>
          </div>
          <p class="specialty-desc" data-bio-text="esp_2_desc">Alinhamento perfeito, toalha quente e massagem facial.</p>
        </div>
      </div>

      <div class="specialty-card">
        <img class="specialty-img" data-bio-image="esp_3_foto" src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=200&auto=format&fit=crop&q=80" alt="Luzes">
        <div class="specialty-info">
          <div class="specialty-top">
            <span class="specialty-name" data-bio-text="esp_3_nome">Luzes</span>
            <span class="specialty-price" data-bio-text="esp_3_preco">R$ 90</span>
          </div>
          <p class="specialty-desc" data-bio-text="esp_3_desc">Platinado ou degradê com descoloração controlada.</p>
        </div>
      </div>

      <div class="specialty-card">
        <img class="specialty-img" data-bio-image="esp_4_foto" src="https://images.unsplash.com/photo-1517832606589-7629c3395907?w=200&auto=format&fit=crop&q=80" alt="Pigmentação">
        <div class="specialty-info">
          <div class="specialty-top">
            <span class="specialty-name" data-bio-text="esp_4_nome">Pigmentação</span>
            <span class="specialty-price" data-bio-text="esp_4_preco">R$ 40</span>
          </div>
          <p class="specialty-desc" data-bio-text="esp_4_desc">Disfarce natural de fios brancos e realce da barba.</p>
        </div>
      </div>

      <div class="specialty-card">
        <img class="specialty-img" data-bio-image="esp_5_foto" src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=200&auto=format&fit=crop&q=80" alt="Sobrancelha">
        <div class="specialty-info">
          <div class="specialty-top">
            <span class="specialty-name" data-bio-text="esp_5_nome">Sobrancelha</span>
            <span class="specialty-price" data-bio-text="esp_5_preco">R$ 25</span>
          </div>
          <p class="specialty-desc" data-bio-text="esp_5_desc">Design com navalha e alinhamento geométrico.</p>
        </div>
      </div>

      <div class="specialty-card">
        <img class="specialty-img" data-bio-image="esp_6_foto" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80" alt="Progressiva">
        <div class="specialty-info">
          <div class="specialty-top">
            <span class="specialty-name" data-bio-text="esp_6_nome">Progressiva</span>
            <span class="specialty-price" data-bio-text="esp_6_preco">R$ 80</span>
          </div>
          <p class="specialty-desc" data-bio-text="esp_6_desc">Alisamento masculino com efeito natural e brilho.</p>
        </div>
      </div>
    </div>

    <!-- Galeria de Fotos / Carrossel (5 Fotos) -->
    <div class="section-header">
      <b>Galeria Black Crown</b>
      <span>5 fotos</span>
    </div>
    <div class="gallery-container" data-bio-gallery="true">
      <img class="gallery-img" data-bio-image="galeria_1" src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&auto=format&fit=crop&q=80" alt="Galeria 1">
      <img class="gallery-img" data-bio-image="galeria_2" src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&auto=format&fit=crop&q=80" alt="Galeria 2">
      <img class="gallery-img" data-bio-image="galeria_3" src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=300&auto=format&fit=crop&q=80" alt="Galeria 3">
      <img class="gallery-img" data-bio-image="galeria_4" src="https://images.unsplash.com/photo-1517832606589-7629c3395907?w=300&auto=format&fit=crop&q=80" alt="Galeria 4">
      <img class="gallery-img" data-bio-image="galeria_5" src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=300&auto=format&fit=crop&q=80" alt="Galeria 5">
    </div>

    <!-- Google Review Button -->
    <a href="https://g.page/r/blackcrown/review" target="_blank" class="google-btn" data-bio-link="google_review">
      <span class="google-stars">★★★★★</span>
      <span>Avalie-nos no Google (4.9 / 5.0)</span>
    </a>

    <!-- Localização & Horário -->
    <div class="section-header">
      <b>Localização & Atendimento</b>
    </div>
    <div class="info-card">
      <p>📍 <b>Endereço:</b> <span data-bio-text="endereco">Av. Imperial, 725 — Centro — Belo Horizonte/MG</span></p>
      <p style="margin-top: 8px;">⏰ <b>Horário:</b> <span data-bio-text="horario">Terça a Sábado: 09h às 20h</span></p>
    </div>

    <div class="footer">
      <p>© <span data-bio-text="nome_empresa">BLACK CROWN BARBER CLUB</span> · Todos os direitos reservados</p>
    </div>
  </div>
</body>
</html>`;

// Template 2: Estética VIP & Harmonização
const TEMPLATE_ESTETICA_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dra. Camila Vasconcelos | Estética Avançada</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #0e0d11; color: #f3f3f5; min-height: 100vh; display: flex; justify-content: center; padding: 24px 14px; }
    .container { max-width: 440px; width: 100%; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 24px; }
    .avatar-wrapper { width: 110px; height: 110px; margin: 0 auto 16px; border-radius: 50%; padding: 3px; background: linear-gradient(135deg, #f472b6, #fb7185, #ec4899); box-shadow: 0 0 25px rgba(244, 114, 182, 0.4); }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 3px solid #0e0d11; }
    .title { font-size: 22px; font-weight: 700; color: #fff; margin-bottom: 4px; }
    .cr { font-size: 12px; color: #f472b6; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
    .bio { font-size: 14px; color: #9ca3af; line-height: 1.5; padding: 0 8px; }
    
    .cta-main { display: flex; align-items: center; justify-content: center; gap: 10px; background: linear-gradient(135deg, #ec4899, #be185d); color: #fff; text-decoration: none; padding: 16px 20px; border-radius: 16px; font-weight: 700; font-size: 15px; margin-top: 18px; margin-bottom: 20px; box-shadow: 0 8px 24px -4px rgba(236, 72, 153, 0.5); }
    
    .card-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
    .link-card { background: rgba(26, 24, 32, 0.85); border: 1px solid rgba(244, 114, 182, 0.2); border-radius: 14px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; color: #fff; text-decoration: none; transition: all 0.2s; }
    .link-card:hover { border-color: #f472b6; transform: translateY(-2px); }
    .link-title { font-weight: 600; font-size: 15px; }
    .link-sub { font-size: 12px; color: #9ca3af; margin-top: 2px; }
    .arrow { color: #f472b6; font-size: 18px; }

    .location-box { background: rgba(26, 24, 32, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 14px; font-size: 13px; color: #9ca3af; line-height: 1.4; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="avatar-wrapper">
        <img class="avatar-img" data-bio-image="avatar" src="https://images.unsplash.com/photo-1594824813576-71d37452d3a3?w=300&auto=format&fit=crop&q=80" alt="Dra. Camila">
      </div>
      <h1 class="title" data-bio-text="nome_profissional">Dra. Camila Vasconcelos</h1>
      <div class="cr" data-bio-text="registro_profissional">CRBM 18.420 · Harmonização Facial & Corporal</div>
      <p class="bio" data-bio-text="bio_descricao">Realçando sua beleza natural com segurança, tecnologia e procedimentos minimamente invasivos.</p>
    </div>

    <a href="https://wa.me/5511999999999?text=Olá%20Dra.%20Camila,%20gostaria%20de%20agendar%20uma%20avaliação!" target="_blank" class="cta-main" data-bio-link="whatsapp">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.54 1.83.822 2.796.822 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.768-5.768-5.768zm7.42 5.766c-.001 4.093-3.328 7.42-7.42 7.42-.001 0-.001 0 0 0-1.282 0-2.457-.333-3.528-.941l-4.148 1.088 1.107-4.043c-.694-1.121-1.066-2.42-1.066-3.754 0-4.092 3.327-7.419 7.42-7.419 4.092 0 7.419 3.327 7.419 7.42 0 0 0 0 0 0z"/></svg>
      <span data-bio-text="cta_texto">Agendar Avaliação Personalizada</span>
    </a>

    <div class="card-list">
      <a href="https://wa.me/5511999999999" class="link-card" data-bio-link="link_botox">
        <div>
          <div class="link-title" data-bio-text="procedimento_1_nome">Toxina Botulínica (Botox)</div>
          <div class="link-sub" data-bio-text="procedimento_1_desc">Prevenção e suavização de linhas de expressão</div>
        </div>
        <span class="arrow">→</span>
      </a>

      <a href="https://wa.me/5511999999999" class="link-card" data-bio-link="link_preenchimento">
        <div>
          <div class="link-title" data-bio-text="procedimento_2_nome">Preenchimento Labial & Malar</div>
          <div class="link-sub" data-bio-text="procedimento_2_desc">Contorno labial anatômico e hidratação profunda</div>
        </div>
        <span class="arrow">→</span>
      </a>

      <a href="https://wa.me/5511999999999" class="link-card" data-bio-link="link_bioestimuladores">
        <div>
          <div class="link-title" data-bio-text="procedimento_3_nome">Bioestimuladores de Colágeno</div>
          <div class="link-sub" data-bio-text="procedimento_3_desc">Firmeza e rejuvenescimento duradouro</div>
        </div>
        <span class="arrow">→</span>
      </a>

      <a href="https://instagram.com" target="_blank" class="link-card" data-bio-link="instagram">
        <div>
          <div class="link-title" data-bio-text="link_instagram_nome">Ver Resultados no Instagram</div>
          <div class="link-sub" data-bio-text="link_instagram_desc">Antes e depois, dicas e rotina no consultório</div>
        </div>
        <span class="arrow">📸</span>
      </a>
    </div>

    <div class="location-box">
      <p>📍 <span data-bio-text="endereco_completo">Edifício Prime Medical · Rua Oscar Freire, 920 - Jardins, SP</span></p>
    </div>
  </div>
</body>
</html>`;

// Template 3: Restaurante & Gastro Park
const TEMPLATE_RESTAURANTE_HTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Burger & Beer Experience</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #070709; color: #ececf1; min-height: 100vh; display: flex; justify-content: center; padding: 20px 12px; }
    .container { max-width: 440px; width: 100%; margin: 0 auto; }
    .banner { width: 100%; height: 160px; border-radius: 20px; overflow: hidden; position: relative; margin-bottom: -40px; box-shadow: 0 10px 30px rgba(0,0,0,0.7); }
    .banner img { width: 100%; height: 100%; object-fit: cover; }
    .profile-area { position: relative; text-align: center; margin-bottom: 20px; }
    .avatar { width: 84px; height: 84px; border-radius: 50%; border: 3px solid #ff5722; margin: 0 auto 10px; object-fit: cover; box-shadow: 0 4px 15px rgba(255, 87, 34, 0.4); }
    .title { font-size: 22px; font-weight: 800; color: #fff; }
    .subtitle { font-size: 13px; color: #ff7043; font-weight: 600; margin-top: 2px; }
    
    .btn-action { display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; padding: 15px; border-radius: 14px; text-decoration: none; font-weight: 700; font-size: 15px; margin-bottom: 12px; transition: transform 0.2s; }
    .btn-action:hover { transform: translateY(-2px); }
    .btn-whatsapp { background: linear-gradient(135deg, #25D366, #128C7E); color: #fff; box-shadow: 0 6px 20px rgba(37, 211, 102, 0.35); }
    .btn-cardapio { background: linear-gradient(135deg, #ff5722, #d84315); color: #fff; box-shadow: 0 6px 20px rgba(255, 87, 34, 0.35); }
    .btn-review { background: #1a1922; border: 1px solid #2f2e3d; color: #fff; }
    
    .info-card { background: #131218; border: 1px solid #24222f; border-radius: 16px; padding: 16px; margin-top: 16px; font-size: 13px; color: #a1a1aa; line-height: 1.6; }
    .info-card b { color: #fff; }
    .stars { color: #fbbf24; font-size: 15px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="banner">
      <img data-bio-image="banner" src="https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80" alt="Capa Restaurante">
    </div>
    <div class="profile-area">
      <img class="avatar" data-bio-image="avatar" src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80" alt="Logo">
      <h1 class="title" data-bio-text="nome_restaurante">The Burger Experience</h1>
      <p class="subtitle" data-bio-text="slogan_restaurante">Smash Burgers · Carnes Nobres · Chope Artesanal</p>
    </div>

    <a href="https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20fazer%20um%20pedido!" target="_blank" class="btn-action btn-whatsapp" data-bio-link="whatsapp">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.54 1.83.822 2.796.822 3.18 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.768-5.768-5.768zm7.42 5.766c-.001 4.093-3.328 7.42-7.42 7.42-.001 0-.001 0 0 0-1.282 0-2.457-.333-3.528-.941l-4.148 1.088 1.107-4.043c-.694-1.121-1.066-2.42-1.066-3.754 0-4.092 3.327-7.419 7.42-7.419 4.092 0 7.419 3.327 7.419 7.42 0 0 0 0 0 0z"/></svg>
      <span data-bio-text="cta_whatsapp">Fazer Pedido no WhatsApp</span>
    </a>

    <a href="https://example.com/cardapio" target="_blank" class="btn-action btn-cardapio" data-bio-link="cardapio_online">
      <span>🍔</span>
      <span data-bio-text="cta_cardapio">Acessar Cardápio Digital</span>
    </a>

    <a href="https://maps.google.com" target="_blank" class="btn-action btn-review" data-bio-link="google_review">
      <span class="stars">★★★★★</span>
      <span data-bio-text="cta_avaliacao">Avaliar no Google (4.9 estrelas)</span>
    </a>

    <div class="info-card">
      <p>📍 <b data-bio-text="rotulo_endereco">Onde estamos:</b> <span data-bio-text="endereco">Rua Gastronômica, 420 - Batel</span></p>
      <p style="margin-top: 6px;">⏰ <b data-bio-text="rotulo_horario">Atendimento:</b> <span data-bio-text="horario">Quarta a Domingo, das 18h às 23h30</span></p>
      <p style="margin-top: 6px;">🚗 <span data-bio-text="diferencial_1">Estacionamento gratuito no local com manobrista</span></p>
    </div>
  </div>
</body>
</html>`;

export const INITIAL_TEMPLATES: BiositeTemplate[] = [
  {
    id: 'template-barbearia-luxo',
    name: 'Black Crown Barber Club',
    nicheId: 'barbearia',
    nicheName: 'Barbearia',
    description: 'Design escuro luxuoso, logo centralizada, 6 especialidades completas com foto e preço, galeria com 5 fotos, agendamento WhatsApp automático, Google Review e localização.',
    coverImage: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
    version: 1,
    status: 'published',
    htmlContent: TEMPLATE_BARBEARIA_HTML,
    authorId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      {
        id: 'logo',
        name: 'Logomarca da Barbearia',
        type: 'logo',
        selector: '[data-bio-image="logo"]',
        attr: 'src',
        dataBioAttr: 'data-bio-image="logo"',
        originalValue: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&auto=format&fit=crop&q=80',
        group: 'Identidade',
      },
      {
        id: 'nome_empresa',
        name: 'Nome da Barbearia',
        type: 'title',
        selector: '[data-bio-text="nome_empresa"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="nome_empresa"',
        originalValue: 'BLACK CROWN BARBER CLUB',
        group: 'Identidade',
      },
      {
        id: 'headline',
        name: 'Título Principal / Headline',
        type: 'title',
        selector: '[data-bio-text="headline"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="headline"',
        originalValue: 'SEU ESTILO COMEÇA AQUI.',
        group: 'Textos',
      },
      {
        id: 'subtitulo',
        name: 'Subtítulo',
        type: 'text',
        selector: '[data-bio-text="subtitulo"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="subtitulo"',
        originalValue: 'Precisão, personalidade e cuidado em cada detalhe.',
        group: 'Textos',
      },
      {
        id: 'whatsapp',
        name: 'Número do WhatsApp',
        type: 'whatsapp',
        selector: '[data-bio-link="whatsapp"]',
        attr: 'href',
        dataBioAttr: 'data-bio-link="whatsapp"',
        originalValue: 'https://wa.me/5531999999999?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20BLACK%20CROWN%20BARBER%20CLUB%20e%20gostaria%20de%20agendar%20meu%20hor%C3%A1rio.',
        group: 'WhatsApp',
      },
      {
        id: 'instagram',
        name: 'Instagram Oficial',
        type: 'instagram',
        selector: '[data-bio-link="instagram"]',
        attr: 'href',
        dataBioAttr: 'data-bio-link="instagram"',
        originalValue: 'https://instagram.com/blackcrownbarber',
        group: 'Redes Sociais',
      },
      {
        id: 'maps',
        name: 'Link do Google Maps',
        type: 'link',
        selector: '[data-bio-link="maps"]',
        attr: 'href',
        dataBioAttr: 'data-bio-link="maps"',
        originalValue: 'https://maps.app.goo.gl/barber',
        group: 'Localização',
      },
      {
        id: 'telefone',
        name: 'Telefone para Ligação Direta',
        type: 'phone',
        selector: '[data-bio-link="telefone"]',
        attr: 'href',
        dataBioAttr: 'data-bio-link="telefone"',
        originalValue: 'tel:+5531999999999',
        group: 'Contatos',
      },
      {
        id: 'google_review',
        name: 'Link de Avaliação Google',
        type: 'link',
        selector: '[data-bio-link="google_review"]',
        attr: 'href',
        dataBioAttr: 'data-bio-link="google_review"',
        originalValue: 'https://g.page/r/blackcrown/review',
        group: 'Avaliação Google',
      },
      {
        id: 'endereco',
        name: 'Endereço Exibido no Site',
        type: 'address',
        selector: '[data-bio-text="endereco"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="endereco"',
        originalValue: 'Av. Imperial, 725 — Centro — Belo Horizonte/MG',
        group: 'Localização',
      },
      {
        id: 'horario',
        name: 'Horário de Funcionamento',
        type: 'hours',
        selector: '[data-bio-text="horario"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="horario"',
        originalValue: 'Terça a Sábado: 09h às 20h',
        group: 'Horários',
      },
      // 6 Especialidades
      {
        id: 'esp_1_nome',
        name: 'Especialidade 1 - Nome',
        type: 'text',
        selector: '[data-bio-text="esp_1_nome"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="esp_1_nome"',
        originalValue: 'Corte',
        group: 'Especialidades',
      },
      {
        id: 'esp_1_preco',
        name: 'Especialidade 1 - Preço',
        type: 'text',
        selector: '[data-bio-text="esp_1_preco"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="esp_1_preco"',
        originalValue: 'R$ 55',
        group: 'Especialidades',
      },
      {
        id: 'esp_1_desc',
        name: 'Especialidade 1 - Descrição',
        type: 'text',
        selector: '[data-bio-text="esp_1_desc"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="esp_1_desc"',
        originalValue: 'Clássico ou moderno, executado com precisão.',
        group: 'Especialidades',
      },
      {
        id: 'esp_1_foto',
        name: 'Especialidade 1 - Foto',
        type: 'image',
        selector: '[data-bio-image="esp_1_foto"]',
        attr: 'src',
        dataBioAttr: 'data-bio-image="esp_1_foto"',
        originalValue: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=200&auto=format&fit=crop&q=80',
        group: 'Especialidades',
      },
      {
        id: 'esp_2_nome',
        name: 'Especialidade 2 - Nome',
        type: 'text',
        selector: '[data-bio-text="esp_2_nome"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="esp_2_nome"',
        originalValue: 'Barba',
        group: 'Especialidades',
      },
      {
        id: 'esp_2_preco',
        name: 'Especialidade 2 - Preço',
        type: 'text',
        selector: '[data-bio-text="esp_2_preco"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="esp_2_preco"',
        originalValue: 'R$ 45',
        group: 'Especialidades',
      },
      {
        id: 'esp_2_desc',
        name: 'Especialidade 2 - Descrição',
        type: 'text',
        selector: '[data-bio-text="esp_2_desc"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="esp_2_desc"',
        originalValue: 'Alinhamento perfeito, toalha quente e massagem facial.',
        group: 'Especialidades',
      },
      {
        id: 'esp_2_foto',
        name: 'Especialidade 2 - Foto',
        type: 'image',
        selector: '[data-bio-image="esp_2_foto"]',
        attr: 'src',
        dataBioAttr: 'data-bio-image="esp_2_foto"',
        originalValue: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=200&auto=format&fit=crop&q=80',
        group: 'Especialidades',
      },
      {
        id: 'esp_3_nome',
        name: 'Especialidade 3 - Nome',
        type: 'text',
        selector: '[data-bio-text="esp_3_nome"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="esp_3_nome"',
        originalValue: 'Luzes',
        group: 'Especialidades',
      },
      {
        id: 'esp_3_preco',
        name: 'Especialidade 3 - Preço',
        type: 'text',
        selector: '[data-bio-text="esp_3_preco"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="esp_3_preco"',
        originalValue: 'R$ 90',
        group: 'Especialidades',
      },
      {
        id: 'esp_3_desc',
        name: 'Especialidade 3 - Descrição',
        type: 'text',
        selector: '[data-bio-text="esp_3_desc"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="esp_3_desc"',
        originalValue: 'Platinado ou degradê com descoloração controlada.',
        group: 'Especialidades',
      },
      {
        id: 'esp_3_foto',
        name: 'Especialidade 3 - Foto',
        type: 'image',
        selector: '[data-bio-image="esp_3_foto"]',
        attr: 'src',
        dataBioAttr: 'data-bio-image="esp_3_foto"',
        originalValue: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=200&auto=format&fit=crop&q=80',
        group: 'Especialidades',
      },
      {
        id: 'esp_4_nome',
        name: 'Especialidade 4 - Nome',
        type: 'text',
        selector: '[data-bio-text="esp_4_nome"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="esp_4_nome"',
        originalValue: 'Pigmentação',
        group: 'Especialidades',
      },
      {
        id: 'esp_4_preco',
        name: 'Especialidade 4 - Preço',
        type: 'text',
        selector: '[data-bio-text="esp_4_preco"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="esp_4_preco"',
        originalValue: 'R$ 40',
        group: 'Especialidades',
      },
      {
        id: 'esp_4_desc',
        name: 'Especialidade 4 - Descrição',
        type: 'text',
        selector: '[data-bio-text="esp_4_desc"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="esp_4_desc"',
        originalValue: 'Disfarce natural de fios brancos e realce da barba.',
        group: 'Especialidades',
      },
      {
        id: 'esp_4_foto',
        name: 'Especialidade 4 - Foto',
        type: 'image',
        selector: '[data-bio-image="esp_4_foto"]',
        attr: 'src',
        dataBioAttr: 'data-bio-image="esp_4_foto"',
        originalValue: 'https://images.unsplash.com/photo-1517832606589-7629c3395907?w=200&auto=format&fit=crop&q=80',
        group: 'Especialidades',
      },
      {
        id: 'esp_5_nome',
        name: 'Especialidade 5 - Nome',
        type: 'text',
        selector: '[data-bio-text="esp_5_nome"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="esp_5_nome"',
        originalValue: 'Sobrancelha',
        group: 'Especialidades',
      },
      {
        id: 'esp_5_preco',
        name: 'Especialidade 5 - Preço',
        type: 'text',
        selector: '[data-bio-text="esp_5_preco"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="esp_5_preco"',
        originalValue: 'R$ 25',
        group: 'Especialidades',
      },
      {
        id: 'esp_5_desc',
        name: 'Especialidade 5 - Descrição',
        type: 'text',
        selector: '[data-bio-text="esp_5_desc"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="esp_5_desc"',
        originalValue: 'Design com navalha e alinhamento geométrico.',
        group: 'Especialidades',
      },
      {
        id: 'esp_5_foto',
        name: 'Especialidade 5 - Foto',
        type: 'image',
        selector: '[data-bio-image="esp_5_foto"]',
        attr: 'src',
        dataBioAttr: 'data-bio-image="esp_5_foto"',
        originalValue: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=200&auto=format&fit=crop&q=80',
        group: 'Especialidades',
      },
      {
        id: 'esp_6_nome',
        name: 'Especialidade 6 - Nome',
        type: 'text',
        selector: '[data-bio-text="esp_6_nome"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="esp_6_nome"',
        originalValue: 'Progressiva',
        group: 'Especialidades',
      },
      {
        id: 'esp_6_preco',
        name: 'Especialidade 6 - Preço',
        type: 'text',
        selector: '[data-bio-text="esp_6_preco"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="esp_6_preco"',
        originalValue: 'R$ 80',
        group: 'Especialidades',
      },
      {
        id: 'esp_6_desc',
        name: 'Especialidade 6 - Descrição',
        type: 'text',
        selector: '[data-bio-text="esp_6_desc"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="esp_6_desc"',
        originalValue: 'Alisamento masculino com efeito natural e brilho.',
        group: 'Especialidades',
      },
      {
        id: 'esp_6_foto',
        name: 'Especialidade 6 - Foto',
        type: 'image',
        selector: '[data-bio-image="esp_6_foto"]',
        attr: 'src',
        dataBioAttr: 'data-bio-image="esp_6_foto"',
        originalValue: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        group: 'Especialidades',
      },
      // Galeria (5 fotos)
      {
        id: 'galeria_1',
        name: 'Galeria - Foto 1',
        type: 'image',
        selector: '[data-bio-image="galeria_1"]',
        attr: 'src',
        dataBioAttr: 'data-bio-image="galeria_1"',
        originalValue: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300&auto=format&fit=crop&q=80',
        group: 'Galeria',
      },
      {
        id: 'galeria_2',
        name: 'Galeria - Foto 2',
        type: 'image',
        selector: '[data-bio-image="galeria_2"]',
        attr: 'src',
        dataBioAttr: 'data-bio-image="galeria_2"',
        originalValue: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=300&auto=format&fit=crop&q=80',
        group: 'Galeria',
      },
      {
        id: 'galeria_3',
        name: 'Galeria - Foto 3',
        type: 'image',
        selector: '[data-bio-image="galeria_3"]',
        attr: 'src',
        dataBioAttr: 'data-bio-image="galeria_3"',
        originalValue: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=300&auto=format&fit=crop&q=80',
        group: 'Galeria',
      },
      {
        id: 'galeria_4',
        name: 'Galeria - Foto 4',
        type: 'image',
        selector: '[data-bio-image="galeria_4"]',
        attr: 'src',
        dataBioAttr: 'data-bio-image="galeria_4"',
        originalValue: 'https://images.unsplash.com/photo-1517832606589-7629c3395907?w=300&auto=format&fit=crop&q=80',
        group: 'Galeria',
      },
      {
        id: 'galeria_5',
        name: 'Galeria - Foto 5',
        type: 'image',
        selector: '[data-bio-image="galeria_5"]',
        attr: 'src',
        dataBioAttr: 'data-bio-image="galeria_5"',
        originalValue: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=300&auto=format&fit=crop&q=80',
        group: 'Galeria',
      },
    ],
  },
  {
    id: 'template-estetica-vip',
    name: 'Estética & Harmonização Facial VIP',
    nicheId: 'beleza-estetica',
    nicheName: 'Beleza & Estética',
    description: 'Paleta rosé luxo, apresentação de autoridade médica/biomédica, lista de procedimentos e agendamento de consulta.',
    coverImage: 'https://images.unsplash.com/photo-1594824813576-71d37452d3a3?w=600&auto=format&fit=crop&q=80',
    version: 1,
    status: 'published',
    htmlContent: TEMPLATE_ESTETICA_HTML,
    authorId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      {
        id: 'avatar',
        name: 'Foto da Profissional / Logo',
        type: 'logo',
        selector: '[data-bio-image="avatar"]',
        attr: 'src',
        dataBioAttr: 'data-bio-image="avatar"',
        originalValue: 'https://images.unsplash.com/photo-1594824813576-71d37452d3a3?w=300&auto=format&fit=crop&q=80',
        group: 'Identidade',
      },
      {
        id: 'nome_profissional',
        name: 'Nome da Profissional ou Clínica',
        type: 'title',
        selector: '[data-bio-text="nome_profissional"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="nome_profissional"',
        originalValue: 'Dra. Camila Vasconcelos',
        group: 'Identidade',
      },
      {
        id: 'registro_profissional',
        name: 'Registro Profissional / Especialidade',
        type: 'text',
        selector: '[data-bio-text="registro_profissional"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="registro_profissional"',
        originalValue: 'CRBM 18.420 · Harmonização Facial & Corporal',
        group: 'Identidade',
      },
      {
        id: 'bio_descricao',
        name: 'Mini Bio de Apresentação',
        type: 'text',
        selector: '[data-bio-text="bio_descricao"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="bio_descricao"',
        originalValue: 'Realçando sua beleza natural com segurança, tecnologia e procedimentos minimamente invasivos.',
        group: 'Identidade',
      },
      {
        id: 'whatsapp',
        name: 'Link do WhatsApp',
        type: 'whatsapp',
        selector: '[data-bio-link="whatsapp"]',
        attr: 'href',
        dataBioAttr: 'data-bio-link="whatsapp"',
        originalValue: 'https://wa.me/5511999999999?text=Olá%20Dra.%20Camila,%20gostaria%20de%20agendar%20uma%20avaliação!',
        group: 'Contatos & Botões',
      },
      {
        id: 'cta_texto',
        name: 'Texto do Botão Principal',
        type: 'text',
        selector: '[data-bio-text="cta_texto"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="cta_texto"',
        originalValue: 'Agendar Avaliação Personalizada',
        group: 'Contatos & Botões',
      },
      {
        id: 'procedimento_1_nome',
        name: 'Procedimento 1 - Nome',
        type: 'text',
        selector: '[data-bio-text="procedimento_1_nome"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="procedimento_1_nome"',
        originalValue: 'Toxina Botulínica (Botox)',
        group: 'Procedimentos',
      },
      {
        id: 'procedimento_2_nome',
        name: 'Procedimento 2 - Nome',
        type: 'text',
        selector: '[data-bio-text="procedimento_2_nome"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="procedimento_2_nome"',
        originalValue: 'Preenchimento Labial & Malar',
        group: 'Procedimentos',
      },
      {
        id: 'procedimento_3_nome',
        name: 'Procedimento 3 - Nome',
        type: 'text',
        selector: '[data-bio-text="procedimento_3_nome"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="procedimento_3_nome"',
        originalValue: 'Bioestimuladores de Colágeno',
        group: 'Procedimentos',
      },
      {
        id: 'endereco_completo',
        name: 'Endereço da Clínica',
        type: 'address',
        selector: '[data-bio-text="endereco_completo"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="endereco_completo"',
        originalValue: 'Edifício Prime Medical · Rua Oscar Freire, 920 - Jardins, SP',
        group: 'Informações',
      },
    ],
  },
  {
    id: 'template-restaurante-gourmet',
    name: 'The Burger & Gastronomia Park',
    nicheId: 'gastronomia-delivery',
    nicheName: 'Gastronomia & Delivery',
    description: 'Banner imersivo, botão de cardápio digital, pedidos via WhatsApp e botão de avaliação 5 estrelas no Google.',
    coverImage: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
    version: 1,
    status: 'published',
    htmlContent: TEMPLATE_RESTAURANTE_HTML,
    authorId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      {
        id: 'banner',
        name: 'Banner Superior de Destaque',
        type: 'image',
        selector: '[data-bio-image="banner"]',
        attr: 'src',
        dataBioAttr: 'data-bio-image="banner"',
        originalValue: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80',
        group: 'Identidade',
      },
      {
        id: 'avatar',
        name: 'Logomarca do Restaurante',
        type: 'logo',
        selector: '[data-bio-image="avatar"]',
        attr: 'src',
        dataBioAttr: 'data-bio-image="avatar"',
        originalValue: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&auto=format&fit=crop&q=80',
        group: 'Identidade',
      },
      {
        id: 'nome_restaurante',
        name: 'Nome do Restaurante',
        type: 'title',
        selector: '[data-bio-text="nome_restaurante"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="nome_restaurante"',
        originalValue: 'The Burger Experience',
        group: 'Identidade',
      },
      {
        id: 'slogan_restaurante',
        name: 'Subtítulo / Especialidades',
        type: 'text',
        selector: '[data-bio-text="slogan_restaurante"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="slogan_restaurante"',
        originalValue: 'Smash Burgers · Carnes Nobres · Chope Artesanal',
        group: 'Identidade',
      },
      {
        id: 'whatsapp',
        name: 'Link WhatsApp Pedidos',
        type: 'whatsapp',
        selector: '[data-bio-link="whatsapp"]',
        attr: 'href',
        dataBioAttr: 'data-bio-link="whatsapp"',
        originalValue: 'https://wa.me/5511999999999?text=Olá,%20gostaria%20de%20fazer%20um%20pedido!',
        group: 'Botões de Ação',
      },
      {
        id: 'cta_whatsapp',
        name: 'Texto do Botão WhatsApp',
        type: 'text',
        selector: '[data-bio-text="cta_whatsapp"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="cta_whatsapp"',
        originalValue: 'Fazer Pedido no WhatsApp',
        group: 'Botões de Ação',
      },
      {
        id: 'cardapio_online',
        name: 'Link do Cardápio Digital',
        type: 'link',
        selector: '[data-bio-link="cardapio_online"]',
        attr: 'href',
        dataBioAttr: 'data-bio-link="cardapio_online"',
        originalValue: 'https://example.com/cardapio',
        group: 'Botões de Ação',
      },
      {
        id: 'google_review',
        name: 'Link de Avaliação Google',
        type: 'link',
        selector: '[data-bio-link="google_review"]',
        attr: 'href',
        dataBioAttr: 'data-bio-link="google_review"',
        originalValue: 'https://maps.google.com',
        group: 'Botões de Ação',
      },
      {
        id: 'endereco',
        name: 'Endereço',
        type: 'address',
        selector: '[data-bio-text="endereco"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="endereco"',
        originalValue: 'Rua Gastronômica, 420 - Batel',
        group: 'Informações',
      },
      {
        id: 'horario',
        name: 'Horário de Funcionamento',
        type: 'hours',
        selector: '[data-bio-text="horario"]',
        attr: 'text',
        dataBioAttr: 'data-bio-text="horario"',
        originalValue: 'Quarta a Domingo, das 18h às 23h30',
        group: 'Informações',
      },
    ],
  },
];
