cTiger = setclass("Tiger", cAnimal)

require("INC_Class.lua")

--===========================

cAnimal=setclass("Animal")

function cAnimal.methods:init(action, cutename) 
	self.superaction = action
	self.supercutename = cutename
end

--==========================

cTiger=setclass("Tiger", cAnimal)

function cTiger.methods:init(cutename) 
	self:init_super("HUNT (Tiger)", "Zoo Animal (Tiger)")
	self.action = "ROAR FOR ME!!"
	self.cutename = cutename
end

--==========================

Tiger1 = cAnimal:new("HUNT", "Zoo Animal")
Tiger2 = cTiger:new("Mr Grumpy")
Tiger3 = cTiger:new("Mr Hungry")

print("CLASSNAME FOR TIGER1 = ", Tiger1:classname())   
print("CLASSNAME FOR TIGER2 = ", Tiger2:classname()) 
print("CLASSNAME FOR TIGER3 = ", Tiger3:classname()) 
print("===============")
print("SUPER ACTION",Tiger1.superaction)
print("SUPER CUTENAME",Tiger1.supercutename)
print("ACTION        ",Tiger1.action)
print("CUTENAME",Tiger1.cutename)
print("===============")
print("SUPER ACTION",Tiger2.superaction)
print("SUPER CUTENAME",Tiger2.supercutename)
print("ACTION        ",Tiger2.action)
print("CUTENAME",Tiger2.cutename)
print("===============")
print("SUPER ACTION",Tiger3.superaction)
print("SUPER CUTENAME",Tiger3.supercutename)
print("ACTION        ",Tiger3.action)
print("CUTENAME",Tiger3.cutename)


-----------------------------------------------------
---- SETCLASS CLONES THE BASIC OBJECT CLASS TO CREATE NEW CLASSES
-----------------------------------------------------
-- Supports INHERITANCE 
--
-- Sam Lie, 17 May 2004 
-- Modified Code from Christian Lindig - lindig (at) cs.uni-sb.de
---------------------------------------------------------------

-- EVERYTHING INHERITS FROM THIS BASIC OBJECT CLASS
BaseObject = {
  super   = nil,
  name    = "Object",
  new     =
    function(class)
      local obj  = {class = class}
      local meta = {
        __index = function(self,key) return class.methods[key] end 
      }            
      setmetatable(obj,meta)
      return obj
    end,
  methods = {classname = function(self) return(self.class.name) end},
  data    = {}
}

function setclass(name, super)
  if (super == nil) then
    super = BaseObject
  end

  local class = {
    super = super; 
    name  = name; 
    new   =
      function(self, ...) 
        local obj = super.new(self, "___CREATE_ONLY___");
          -- check if calling function init
          -- pass arguments into init function
        if (super.methods.init) then
          obj.init_super = super.methods.init
        end

	if (self.methods.init) then
            if (tostring(arg[1]) ~= "___CREATE_ONLY___") then
              obj.init = self.methods.init
              if obj.init then
                obj:init(unpack(arg))
              end
            end
	end

        return obj
      end,  
    methods = {}
  }
    
  -- if class slot unavailable, check super class
  -- if applied to argument, pass it to the class method new        
  setmetatable(class, {
    __index = function(self,key) return self.super[key] end,
    __call  = function(self,...) return self.new(self,unpack(arg)) end 
  })

  -- if instance method unavailable, check method slot in super class    
  setmetatable(class.methods, {
    __index = function(self,key) return class.super.methods[key] end
  })
  return class
end    