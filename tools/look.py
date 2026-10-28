import sys
from PIL import Image
args=sys.argv[1:];W=600;H=int(W*297/210)
ims=[Image.open(a).convert('RGB') for a in args]
s=Image.new('RGB',(len(ims)*(W+10)+10,H+20),(200,205,200))
for k,im in enumerate(ims): s.paste(im.resize((W,H),Image.LANCZOS),(10+k*(W+10),10))
s.save('look.png')
