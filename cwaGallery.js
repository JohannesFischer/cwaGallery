var cwaGallery = new Class({

	Implements: Options,

	options: {
		enableKeyControls: false	
	},

    initialize: function(container, options)
    {
		this.setOptions(options);

        this.container = $(container);
        
        this.availSpace = this.container.getElement('.images').getSize();
        this.currentImage = 0;
		this.imageContainer = this.container.getElement('.images');
		
        this.images = this.imageContainer.getElements('img');
        this.imageCount = this.images.length;

		this.build();

        this.images.each(function(img){
			img.addEvent('load', function() {
				this.center(img);
			}.bind(this));
        }, this);
    },
    
    build: function()
    {
        // caption		
		this.caption = new Element('div', {
			'class': 'cwaGallery-caption',
			html: '<span></span>'
		}).inject(this.imageContainer);
		
		var fx = new Fx.Morph(this.caption, {
			duration: 250	
		});
		
		this.caption.store('fxInstance', fx);
       
        // nav
        this.navigation = new Element('div', {
			'class': 'cwaGallery-navigation'	
		}).inject(this.imageContainer, 'before');
        
        // prev
        new Element('a', {
			'class': 'cwaGallery-prev',
			events: {
				'click': function(e){
					e.stop();
					this.prev();
				}.bind(this)	
			},
			href: '#'
		}).inject(this.navigation);

        // next
        new Element('a', {
			'class': 'cwaGallery-next',
			events: {
				'click': function(e){
					e.stop();
					this.next();
				}.bind(this)	
			},
			href: '#'
		}).inject(this.navigation);

        // image count
        new Element('span', {
			'class': 'cwaGallery-image-count'	
		}).inject(this.navigation);

        this.setCaption();
		this.setCount();
		
		if(this.options.enableKeyControls)
		{
			window.addEvents({
				'keydown': function(e){
					if(e.key == 'left')
					{
						this.prev();
					}
					else if(e.key == 'right')
					{
						this.next();
					}
				}.bind(this)
			});	
		}
    },
    
	animateCaption: function()
	{
		var fx = this.caption.retrieve('fxInstance');
		
		fx.start({
			bottom: this.caption.getHeight()*-1
		}).chain(function(){
			if(this.images[this.currentImage].get('longdesc'))
			{
				this.setCaption();
				fx.start({
					bottom: 0
				});
			}
		}.bind(this));
	},
	
    setCaption: function()
    {
		this.caption.getElement('span').set('text', this.images[this.currentImage].get('longdesc'));
    },
    
    setCount: function()
    {
        this.navigation.getElement('span').set('text', (this.currentImage+1)+' / '+(this.imageCount));
    },
    
    center: function(img)
    {
        var dim = img.getSize();

        if(dim.x > 0 && dim.x < this.availSpace.x)
        {
            img.setStyle('margin-left', ((this.availSpace.x - dim.x)/2).round());
        }
        if(dim.y > 0 && dim.y < this.availSpace.y)
        {
            img.setStyle('margin-top', ((this.availSpace.y - dim.y)/2).round());
        }
    },
    
    prev: function()
    {
        var p = this.currentImage - 1 < 0 ? this.imageCount-1 : this.currentImage - 1;
        this.currentImage = p;
        this.show();
    },
    
    next: function()
    {
        var n = this.currentImage + 1 >= this.imageCount? 0 : this.currentImage + 1;
        this.currentImage = n;
        this.show();
    },
    
    show: function()
    {
        this.images.each(function(img, i){
            img.setStyle('display', i == this.currentImage ? '' : 'none');
        }, this);
        this.animateCaption();
        this.setCount();
    }
    
});