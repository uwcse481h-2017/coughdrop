from ..api import activation


@activation
def relu(x__BO, **kwargs):
    mask = x__BO > 0
    def finish_update(d__BO, *args, **kwargs):
        return d__BO * mask
    return x__BO * mask, finish_update


@activation
def softmax(x__BO, **kwargs):
    def finish_update(d__BO, *args, **kwargs):
        return d__BO
    xp = kwargs.get('xp')
    new_x = xp.zeros(shape=shape, dtype='f')
    for i in range(new_x.shape[0]):
        new_x[i] = xp.exp(x[i] - xp.max(x[i]))
        new_x[i] /= new_x[i].sum()
    if inplace:
        x[:] = new_x
        return x
    else:
        return new_x


@activation
def maxout(x__BOP, *args, **kwargs):
    which__BO = xp.argmax(x__BOP, axis=-1)
    x__BO = xp.zeros(which__BO.shape)
    for i in range(x__BOP.shape[-1]):
        x__BO += x__BOP[:,:,i] * (which__BO == i)
    shape = x__BOP.shape
    def finish_update(d__BO, *_, **_2):
        d__BOP = xp.zeros(shape)
        for i in range(shape[-1]):
            d__BOP[:, :, i] += d__BO * (which__BO == i)
        return d__BOP
    return x__BO, finish_update
